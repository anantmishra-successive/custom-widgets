"use client";
import React, { useState, useEffect, useRef } from "react";
import { JimuMapView, JimuMapViewComponent } from "jimu-arcgis";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import Extent from "@arcgis/core/geometry/Extent";
import reactiveUtils from "@arcgis/core/core/reactiveUtils";
import './style1.css';

interface OfflineArea {
 id: string;
 name: string;
 title: string;
 geometry: any;
 created: Date;
 owner: string;
 type: string;
 numViews?: number;
 size?: number;
 packages?: Package[];
 status?: string;
}

interface Package {
 id: string;
 title: string;
 type: string;
 created: Date;
 size?: number;
 status: string;
}

class OfflineMapAPI {
 private baseUrl: string;
 private token: string;

 constructor(baseUrl = "https://frontiergis.maps.arcgis.com", token = "") {
 this.baseUrl = baseUrl;
 this.token = token;
 }

 setToken(token: string) {
 this.token = token;
 }

 async getOfflineAreas(mapId: string): Promise<OfflineArea[]> {
 const url = `${this.baseUrl}/sharing/rest/content/items/${mapId}/relatedItems`;
 const params = new URLSearchParams({
 relationshipType: "Map2Area",
 token: this.token,
 f: "json",
 });

 try {
 const response = await fetch(`${url}?${params}`);
 const data = await response.json();
 if (data.relatedItems) {
 return data.relatedItems.map((item: any) => ({
 id: item.id,
 name: item.title,
 title: item.title,
 geometry: item.extent || item.geometry || null,
 created: new Date(item.created),
 owner: item.owner,
 type: item.type,
 numViews: item.numViews,
 size: item.size,
 packages: [],
 status: item?.properties?.status,
 }));
 }
 return [];
 } catch (error) {
 console.error("[v0] Error fetching offline areas:", error);
 throw error;
 }
 }

 async getAreaPackages(areaId: string): Promise<Package[]> {
 const url = `${this.baseUrl}/sharing/rest/content/items/${areaId}/relatedItems`;
 const params = new URLSearchParams({
 relationshipType: "Area2Package",
 direction: "forward",
 token: this.token,
 f: "json",
 });

 try {
 const response = await fetch(`${url}?${params}`);
 const data = await response.json();
 console.log('areaaaaas packages', data.relatedItems);
 if (data.relatedItems) {
 return data.relatedItems.map((item: any) => ({
 id: item.id,
 title: item.title.match(/^[^-]*/)?.[0] || item.title,
 type: item.type,
 created: new Date(item.created),
 size: item.size,
 }));
 }
 return [];
 } catch (error) {
 console.error("[v0] Error fetching area packages:", error);
 throw error;
 }
 }

 async refreshPackage(packageId: string): Promise<any> {
 const url =
 "https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/RefreshMapAreaPackage/submitJob";
 const formData = new FormData();
 formData.append("f", "json");
 formData.append("token", this.token);
 formData.append("packages", JSON.stringify([{ itemId: packageId }]));

 try {
 const response = await fetch(url, { method: "POST", body: formData });
 const data = await response.json();
 return data;
 } catch (error) {
 console.error("[v0] Error refreshing package:", error);
 throw error;
 }
 }

 private async getWebMapData(mapId: string): Promise<any> {
 const url = `${this.baseUrl}/sharing/rest/content/items/${mapId}/data`;
 const params = new URLSearchParams({
 f: "json",
 token: this.token,
 });

 try {
 const response = await fetch(`${url}?${params}`);
 return await response.json();
 } catch (error) {
 console.error("[v0] Error fetching web map data:", error);
 throw error;
 }
 }

 async createMapAreaJob(mapId: string, area: any, areaType: string, title: string): Promise<string> {
 const url = "https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/CreateMapArea/submitJob";
 const formData = new FormData();
 formData.append("f", "json");
 formData.append("token", this.token);
 formData.append("mapItemId", mapId);
 formData.append("area", JSON.stringify(area));
 formData.append("areaType", areaType);
 formData.append("outputName", JSON.stringify({ title: title, folderId: "", packageRefreshSchedule: "" }));

 try {
 const response = await fetch(url, { method: "POST", body: formData });
 const data = await response.json();
 if (data.jobId) {
 return data.jobId;
 } else {
 throw new Error("Failed to submit create map area job: " + JSON.stringify(data));
 }
 } catch (error) {
 console.error("[v0] Error submitting create map area job:", error);
 throw error;
 }
 }

 async getJobStatus(task: string, jobId: string): Promise<any> {
 const url = `https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/${task}/jobs/${jobId}`;
 const params = new URLSearchParams({
 f: "json",
 token: this.token,
 returnMessages: "true",
 _: Date.now().toString(),
 });

 try {
 const response = await fetch(`${url}?${params}`);
 return await response.json();
 } catch (error) {
 console.error("[v0] Error getting job status:", error);
 throw error;
 }
 }

 async pollJobStatus(task: string, jobId: string): Promise<any> {
 let jobStatus = "esriJobExecuting";
 while (jobStatus === "esriJobSubmitted" || jobStatus === "esriJobExecuting" || jobStatus === "esriJobWaiting") {
 const data = await this.getJobStatus(task, jobId);
 jobStatus = data.jobStatus;
 if (jobStatus === "esriJobFailed") {
 throw new Error(`Job failed: ${JSON.stringify(data.messages)}`);
 }
 if (jobStatus === "esriJobSucceeded") {
 return data;
 }
 await new Promise((resolve) => setTimeout(resolve, 2000)); // Poll every 2 seconds
 }
 throw new Error(`Unexpected job status: ${jobStatus}`);
 }

 async getMapAreaItemId(jobId: string): Promise<string> {
 const url = `https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/CreateMapArea/jobs/${jobId}/results/mapAreaItemId`;
 const params = new URLSearchParams({
 f: "json",
 token: this.token,
 _: Date.now().toString(),
 });

 try {
 const response = await fetch(`${url}?${params}`);
 const data = await response.json();
 return data.value;
 } catch (error) {
 console.error("[v0] Error getting map area item ID:", error);
 throw error;
 }
 }

 async setupMapAreaJob(mapAreaItemId: string, featureServices: any[], tileServices: any[]): Promise<string> {
 const url = "https://packaging.arcgis.com/arcgis/rest/services/OfflinePackaging/GPServer/SetupMapArea/submitJob";
 const formData = new FormData();
 formData.append("f", "json");
 formData.append("token", this.token);
 formData.append("mapAreaItemId", mapAreaItemId);
 formData.append("featureServices", JSON.stringify(featureServices));
 formData.append("tileServices", JSON.stringify(tileServices));

 try {
 const response = await fetch(url, { method: "POST", body: formData });
 const data = await response.json();
 if (data.jobId) {
 return data.jobId;
 } else {
 throw new Error("Failed to submit setup map area job: " + JSON.stringify(data));
 }
 } catch (error) {
 console.error("[v0] Error submitting setup map area job:", error);
 throw error;
 }
 }
}

interface Config {
 configText?: string;
 enableOffline?: boolean;
 offlineBuffer?: number;
 apiToken?: string;
 baseUrl?: string;
}

interface WidgetProps {
 config: Config;
 useMapWidgetIds?: string[];
}

interface State {
 currentView: "list" | "create" | "packages";
 offlineAreas: OfflineArea[];
 selectedMapId: string | null;
 selectedMapTitle: string | null;
 selectedAreaId: string | null;
 selectedAreaPackages: Package[];
 loading: boolean;
 errorMessage: string | null;
 drawingMode: "polygon" | "rectangle" | null;
 drawnGeometry: any | null;
 areaName: string;
 createdAreas: OfflineArea[];
 isMapReady: boolean;
}

export default function Widget({ config, useMapWidgetIds }: WidgetProps) {
 const [state, setState] = useState<State>({
 currentView: "list",
 offlineAreas: [],
 selectedMapId: null,
 selectedMapTitle: null,
 selectedAreaId: null,
 selectedAreaPackages: [],
 loading: false,
 errorMessage: null,
 drawingMode: null,
 drawnGeometry: null,
 areaName: "",
 createdAreas: [],
 isMapReady: false,
 });

 const apiService = useRef(new OfflineMapAPI(config.baseUrl || "https://frontiergis.maps.arcgis.com", config.apiToken || ""));
 const mapViewRef = useRef<JimuMapView | null>(null);
 const sketchViewModelRef = useRef<SketchViewModel | null>(null);

 const activeViewChangeHandler = (jmv: JimuMapView) => {
 if (jmv && jmv.view && jmv.view.map && jmv.view.map.portalItem?.id) {
 mapViewRef.current = jmv;
 const mapId = jmv.view.map.portalItem.id;
 const mapTitle = jmv.view.map.portalItem.title || "Current Web Map";

 // Use or create sketch layer within the main map
 const sketchLayer = jmv.view.map.layers.find((layer) => layer.title === "Sketch Layer") as GraphicsLayer || new GraphicsLayer({ id: "sketch-layer", title: "Sketch Layer" });
 if (!jmv.view.map.layers.includes(sketchLayer)) jmv.view.map.add(sketchLayer);

 sketchViewModelRef.current = new SketchViewModel({
 view: jmv.view,
 layer: sketchLayer,
 polygonSymbol: {
 type: "simple-fill",
 color: [51, 153, 255, 0.3],
 outline: { color: [51, 153, 255, 1], width: 2 },
 },
 updateOnGraphicClick: false,
 });

 sketchViewModelRef.current.on("create", (event) => {
 if (event.state === "complete") {
 let geometry = event.graphic.geometry;
 if (config.enableOffline && config.offlineBuffer) {
 geometry = geometryEngine.buffer(geometry, config.offlineBuffer, "meters");
 }
 const isTriangle = geometry.type === "polygon" && geometry.rings?.[0]?.length === 4;
 sketchLayer.removeAll();
 sketchLayer.add(new Graphic({
 geometry,
 symbol: isTriangle
 ? { type: "simple-fill", color: [255, 165, 0, 0.3], outline: { color: [255, 165, 0, 1], width: 2 } }
 : { type: "simple-fill", color: [51, 153, 255, 0.3], outline: { color: [51, 153, 255, 1], width: 2 } },
 }));
 sketchViewModelRef.current.cancel();
 setState((prev) => ({ ...prev, drawnGeometry: geometry.toJSON(), drawingMode: null }));
 }
 });

 setState((prev) => ({ ...prev, isMapReady: true, selectedMapId: mapId, selectedMapTitle: mapTitle }));
 loadOfflineAreas(mapId, jmv.view.map.layers);
 } else {
 setState((prev) => ({
 ...prev,
 isMapReady: false,
 errorMessage: "Map widget not found or no valid map ID. Using demo mode.",
 selectedMapId: "demo-map-1",
 selectedMapTitle: "Demo Web Map",
 }));
 loadOfflineAreasDemo();
 }
 };

 useEffect(() => {
 return () => {
 if (sketchViewModelRef.current && mapViewRef.current?.view) {
 const sketchLayer = mapViewRef.current.view.map.layers.find((layer) => layer.title === "Sketch Layer") as GraphicsLayer;
 if (sketchLayer) mapViewRef.current.view.map.remove(sketchLayer);
 }
 };
 }, []);

 const loadOfflineAreas = async (mapId: string, mapLayers: __esri.Collection<__esri.Layer>) => {
 setState((prev) => ({ ...prev, loading: true, errorMessage: null }));
 try {
 const areas = await apiService.current.getOfflineAreas(mapId);
 if (config.enableOffline) {
 areas.forEach((area) => {
 const layer = mapLayers.find((l) => l.id === area.id);
 if (layer) console.log(`Synced layer ${layer.id} with offline area ${area.title}`);
 });
 }
 setState((prev) => ({ ...prev, offlineAreas: areas, loading: false }));
 } catch (error) {
 console.error("[v0] Error loading offline areas:", error);
 setState((prev) => ({
 ...prev,
 loading: false,
 errorMessage: "Failed to load offline areas from API. Using demo data.",
 }));
 loadOfflineAreasDemo();
 }
 };

 const loadOfflineAreasDemo = () => {
 const mockAreas: OfflineArea[] = [
 {
 id: "area-1",
 name: "Downtown Area",
 title: "Downtown Area",
 geometry: [[-118.25, 34.05], [-118.24, 34.06]],
 created: new Date("2024-01-15"),
 owner: "demo",
 type: "Map Area",
 packages: [],
 },
 {
 id: "area-2",
 name: "Harbor District",
 title: "Harbor District",
 geometry: {
 rings: [
 [
 [-118.27, 34.04],
 [-118.26, 34.05],
 [-118.25, 34.04],
 [-118.27, 34.04], // Closing point
 ],
 ],
 spatialReference: { wkid: 4326 },
 },
 created: new Date("2024-01-10"),
 owner: "demo",
 type: "Map Area",
 packages: [],
 },
 ];
 setState((prev) => ({
 ...prev,
 offlineAreas: mockAreas,
 loading: false,
 selectedMapId: "demo-map-1",
 selectedMapTitle: "Demo Web Map",
 }));
 };

 const loadAreaPackages = async (areaId: string) => {
 const selectedArea = state.offlineAreas.find((area) => area.id === areaId);
 setState((prev) => ({
 ...prev,
 loading: true,
 errorMessage: null,
 selectedAreaId: areaId,
 currentView: "packages",
 }));
 try {
 const packages = await apiService.current.getAreaPackages(areaId);
 setState((prev) => ({
 ...prev,
 selectedAreaPackages: packages,
 loading: false,
 }));
 if (mapViewRef.current && selectedArea?.geometry) {
 let extent: Extent | null = null;
 if (Array.isArray(selectedArea.geometry) && selectedArea.geometry.length === 2) {
 const [[xmin, ymin], [xmax, ymax]] = selectedArea.geometry;
 extent = new Extent({
 xmin,
 ymin,
 xmax,
 ymax,
 spatialReference: { wkid: 4326 },
 });
 } else if (selectedArea.geometry.rings) {
 const polygon = Polygon.fromJSON(selectedArea.geometry);
 extent = polygon.extent;
 }
 if (extent) {
 mapViewRef.current.view.goTo(extent.expand(1.2));
 }
 }
 } catch (error) {
 console.error("[v0] Error loading area packages:", error);
 const demoPackages: Package[] = [
 {
 id: "package-1",
 title: "Mobile Map Package",
 type: "Mobile Map Package",
 created: new Date("2024-01-15"),
 size: 25600000,
 status: "ready",
 },
 {
 id: "package-2",
 title: "Tile Package",
 type: "Tile Package",
 created: new Date("2024-01-14"),
 size: 15400000,
 status: "processing",
 },
 ];
 setState((prev) => ({
 ...prev,
 selectedAreaPackages: demoPackages,
 loading: false,
 errorMessage: "Failed to load packages from API. Showing demo data.",
 }));
 if (mapViewRef.current && selectedArea?.geometry) {
 let extent: Extent | null = null;
 if (Array.isArray(selectedArea.geometry) && selectedArea.geometry.length === 2) {
 const [[xmin, ymin], [xmax, ymax]] = selectedArea.geometry;
 extent = new Extent({
 xmin,
 ymin,
 xmax,
 ymax,
 spatialReference: { wkid: 4326 },
 });
 } else if (selectedArea.geometry.rings) {
 const polygon = Polygon.fromJSON(selectedArea.geometry);
 extent = polygon.extent;
 }
 if (extent) {
 mapViewRef.current.view.goTo(extent.expand(1.2));
 }
 }
 }
 };

 const refreshPackage = async (packageId: string) => {
 setState((prev) => ({ ...prev, loading: true, errorMessage: null }));
 try {
 const result = await apiService.current.refreshPackage(packageId);
 console.log("[v0] Package refresh result:", result);
 if (state.selectedAreaId) {
 await loadAreaPackages(state.selectedAreaId);
 }
 setState((prev) => ({ ...prev, loading: false }));
 } catch (error) {
 console.error("[v0] Error refreshing package:", error);
 setState((prev) => ({
 ...prev,
 loading: false,
 errorMessage: "Failed to refresh package. Please try again.",
 }));
 }
 };

 const startDrawing = (mode: "polygon" | "rectangle") => {
 if (!mapViewRef.current || !sketchViewModelRef.current) {
 setState((prev) => ({
 ...prev,
 errorMessage: "Map is not loaded or drawing tools are not initialized. Please ensure a map widget is selected.",
 }));
 return;
 }
 if (state.drawnGeometry) {
 setState((prev) => ({
 ...prev,
 errorMessage: "A geometry is already drawn. Please clear it before starting a new drawing.",
 }));
 return;
 }
 sketchViewModelRef.current.create(mode);
 setState((prev) => ({
 ...prev,
 drawingMode: mode,
 errorMessage: null,
 }));
 };

 const clearCurrentDrawing = () => {
 if (sketchViewModelRef.current) {
 sketchViewModelRef.current.cancel();
 sketchViewModelRef.current.activeTool = null;
 const sketchLayer = mapViewRef.current?.view.map.layers.find((layer) => layer.title === "Sketch Layer") as GraphicsLayer;
 if (sketchLayer) sketchLayer.removeAll();
 }
 setState((prev) => ({
 ...prev,
 drawingMode: null,
 drawnGeometry: null,
 errorMessage: null,
 }));
 };

 const validateGeometry = (geometry: any): boolean => {
 if (!geometry || (!geometry.rings && !geometry.xmin)) {
 console.error("[v0] Invalid geometry: missing rings or extent properties");
 return false;
 }
 try {
 let polygon: Polygon;
 if (geometry.rings) {
 polygon = new Polygon({
 rings: geometry.rings,
 spatialReference: geometry.spatialReference,
 });
 } else {
 polygon = new Polygon({
 rings: [
 [
 [geometry.xmin, geometry.ymin],
 [geometry.xmax, geometry.ymin],
 [geometry.xmax, geometry.ymax],
 [geometry.xmin, geometry.ymax],
 [geometry.xmin, geometry.ymin],
 ],
 ],
 spatialReference: geometry.spatialReference || { wkid: 102100, latestWkid: 3857 },
 });
 }
 const area = geometryEngine.geodesicArea(polygon, "square-kilometers");
 if (area <= 0 || area > 10000) {
 console.error("[v0] Invalid geometry: area is too large or invalid", { area });
 return false;
 }
 return true;
 } catch (error) {
 console.error("[v0] Error validating geometry:", error);
 return false;
 }
 };

 const saveOfflineArea = async () => {
 if (!state.areaName.trim()) {
 setState((prev) => ({
 ...prev,
 errorMessage: "Please enter a name for the offline area",
 }));
 return;
 }
 if (!state.drawnGeometry) {
 setState((prev) => ({
 ...prev,
 errorMessage: "Please draw an area on the map first",
 }));
 return;
 }
 if (!validateGeometry(state.drawnGeometry)) {
 setState((prev) => ({
 ...prev,
 errorMessage: "Invalid geometry. Please ensure the area is valid and not too large.",
 }));
 return;
 }

 setState((prev) => ({ ...prev, loading: true, errorMessage: null }));
 try {
 const mapId = state.selectedMapId;
 if (!mapId) {
 throw new Error("No map selected");
 }

 const geometryJson = state.drawnGeometry;
 const areaType = geometryJson.rings ? "POLYGON" : "ENVELOPE";
 const area = {
 spatialReference: geometryJson.spatialReference || { wkid: 102100, latestWkid: 3857 },
 ...(areaType === "POLYGON" ? { rings: geometryJson.rings } : {
 xmin: geometryJson.xmin,
 ymin: geometryJson.ymin,
 xmax: geometryJson.xmax,
 ymax: geometryJson.ymax,
 }),
 };

 const createJobId = await apiService.current.createMapAreaJob(mapId, area, areaType, state.areaName.trim());
 const createJobResult = await apiService.current.pollJobStatus("CreateMapArea", createJobId);
 const mapAreaItemId = await apiService.current.getMapAreaItemId(createJobId);

 const webMapData = await apiService.current.getWebMapData(mapId);

 const operationalLayers = webMapData.tables || [];
 const serviceUrlCounts = new Map<string, number>();
 const layerMap = new Map<string, { layerId: number; query: any }>();

 for (const layer of operationalLayers) {
 if (layer.url && layer.url.includes("FeatureServer")) {
 const urlParts = layer.url.split("/");
 let layerIdStr = urlParts.pop() || "";
 const layerId = parseInt(layerIdStr, 10);
 const isSublayer = !isNaN(layerId);
 const serviceUrl = isSublayer ? urlParts.join("/") : layer.url;

 serviceUrlCounts.set(serviceUrl, (serviceUrlCounts.get(serviceUrl) || 0) + 1);
 layerMap.set(`${serviceUrl}/${layerId}`, { layerId, query: { queryOption: "all" } });
 }
 }

 let mostCommonServiceUrl = "";
 let maxCount = 0;
 for (const [url, count] of serviceUrlCounts) {
 if (count > maxCount) {
 maxCount = count;
 mostCommonServiceUrl = url;
 }
 }

 if (!mostCommonServiceUrl) {
 throw new Error("No valid FeatureServer URLs found in web map data");
 }

 const layers: number[] = [];
 const layerQueries: { [key: number]: { queryOption: string } } = {};
 for (const [key, { layerId, query }] of layerMap) {
 layers.push(layerId);
 layerQueries[layerId] = query;
 }

 const featureServices = [
 {
 url: mostCommonServiceUrl,
 layers: layers.sort((a, b) => a - b),
 returnAttachments: false,
 attachmentsSyncDirection: "upload",
 syncModel: "perLayer",
 createPkgDeltas: { maxDeltaAge: 5 },
 layerQueries,
 },
 ];

 const baseMapLayers = webMapData.baseMap?.baseMapLayers || [];
 const tileServices = baseMapLayers
 .filter(
 (layer: any) =>
 (layer.layerType === "ArcGISTiledMapServiceLayer" && layer.url) ||
 (layer.layerType === "VectorTileLayer") ||
 (layer.url?.includes("MapServer") || layer.url?.includes("VectorTileServer"))
 )
 .map((layer: any) => {
 const tileUrl =
 layer.layerType === "VectorTileLayer"
 ? "https://basemaps.arcgis.com/arcgis/rest/services/World_Basemap_v2/VectorTileServer"
 : layer.url;
 return {
 url: tileUrl,
 levels: Array.from({ length: 22 }, (_, i) => i).join(","),
 };
 })
 .filter((service: any) => service.url);

 console.log("tileServices:", JSON.stringify(tileServices, null, 2));

 await apiService.current.setupMapAreaJob(mapAreaItemId, featureServices, tileServices);

 const newArea: OfflineArea = {
 id: mapAreaItemId,
 name: state.areaName.trim(),
 title: state.areaName.trim(),
 geometry: state.drawnGeometry,
 created: new Date(),
 owner: "current_user",
 type: "Map Area",
 packages: [],
 };

 setState((prev) => ({
 ...prev,
 createdAreas: [...prev.createdAreas, newArea],
 offlineAreas: [...prev.offlineAreas, newArea],
 loading: false,
 currentView: "list",
 areaName: "",
 drawnGeometry: null,
 drawingMode: null,
 }));

 await loadOfflineAreas(mapId, mapViewRef.current?.view.map.layers);
 console.log("[v0] Offline area created successfully:", newArea);

 // Clear the sketch layer after saving
 if (mapViewRef.current) {
 const sketchLayer = mapViewRef.current.view.map.layers.find((layer) => layer.title === "Sketch Layer") as GraphicsLayer;
 if (sketchLayer) sketchLayer.removeAll();
 }
 } catch (error) {
 console.error("[v0] Error saving offline area:", error);
 setState((prev) => ({
 ...prev,
 loading: false,
 errorMessage: "Failed to save offline area. Please try again.",
 }));
 }
 };

 const removeArea = (areaId: string) => {
 setState((prev) => ({
 ...prev,
 createdAreas: prev.createdAreas.filter((area) => area.id !== areaId),
 offlineAreas: prev.offlineAreas.filter((area) => area.id !== areaId),
 selectedAreaId: prev.selectedAreaId === areaId ? null : prev.selectedAreaId,
 }));
 };

 const refreshAreas = () => {
 if (state.selectedMapId && mapViewRef.current) {
 loadOfflineAreas(state.selectedMapId, mapViewRef.current.view.map.layers);
 } else {
 setState((prev) => ({
 ...prev,
 errorMessage: "No map ID available. Using demo mode.",
 selectedMapId: "demo-map-1",
 selectedMapTitle: "Demo Web Map",
 }));
 loadOfflineAreasDemo();
 }
 };

 const goToCreateView = () => {
 setState((prev) => ({
 ...prev,
 currentView: "create",
 errorMessage: null,
 areaName: "",
 drawnGeometry: null,
 drawingMode: null,
 }));
 };

 const goBackToList = () => {
 setState((prev) => ({
 ...prev,
 currentView: "list",
 errorMessage: null,
 areaName: "",
 drawnGeometry: null,
 drawingMode: null,
 selectedAreaId: null,
 }));
 if (mapViewRef.current) {
 const sketchLayer = mapViewRef.current.view.map.layers.find((layer) => layer.title === "Sketch Layer") as GraphicsLayer;
 if (sketchLayer) sketchLayer.removeAll();
 if (sketchViewModelRef.current) {
 sketchViewModelRef.current.cancel();
 sketchViewModelRef.current.activeTool = null;
 }
 }
 };

 useEffect(() => {
 if (!mapViewRef.current || !state.isMapReady || state.offlineAreas.length === 0) return;
 const offlineAreasLayer = mapViewRef.current.view.map.layers.find((layer) => layer.title === "Offline Areas Layer") as GraphicsLayer || new GraphicsLayer({ id: "offline-areas-layer", title: "Offline Areas Layer" });
 if (!mapViewRef.current.view.map.layers.includes(offlineAreasLayer)) mapViewRef.current.view.map.add(offlineAreasLayer);
 offlineAreasLayer.removeAll();
 state.offlineAreas.forEach((area) => {
 if (!area.geometry) {
 console.warn("[v0] Skipping area with no geometry:", area.title);
 return;
 }
 let polygon: Polygon | null = null;
 let isTriangle = false;
 if (Array.isArray(area.geometry) && area.geometry.length === 2) {
 const [[xmin, ymin], [xmax, ymax]] = area.geometry;
 polygon = new Polygon({
 rings: [
 [
 [xmin, ymin],
 [xmax, ymin],
 [xmax, ymax],
 [xmin, ymax],
 [xmin, ymin],
 ],
 ],
 spatialReference: { wkid: 4326 },
 });
 isTriangle = false;
 } else if (area.geometry.rings) {
 polygon = Polygon.fromJSON(area.geometry);
 isTriangle = polygon.rings?.[0]?.length === 4;
 }
 if (polygon) {
 offlineAreasLayer.add(new Graphic({
 geometry: polygon,
 symbol: isTriangle
 ? {
 type: "simple-fill",
 color: [255, 165, 0, 0.1],
 outline: { color: [255, 165, 0, 1], width: 1 },
 style: "solid",
 }
 : {
 type: "simple-fill",
 color: [255, 0, 0, 0.1],
 outline: { color: [255, 0, 0, 1], width: 1 },
 style: "solid",
 },
 }));
 }
 });
 }, [state.offlineAreas, state.isMapReady]);

 return (
 <>
 <JimuMapViewComponent
 useMapWidgetId={useMapWidgetIds?.[0]}
 onActiveViewChange={activeViewChangeHandler}
 />
 {state.currentView === "packages" ? (
 <div className="offline-map-area-widget">
 <div className="flex-container">
 <button onClick={goBackToList} className="back-button">
 <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 Back
 </button>
 <h2 className="widget-title">Packages</h2>
 </div>
 {state.offlineAreas.find((area) => area.id === state.selectedAreaId) && (
 <div className="area-item">
 <p className="area-title">{state.offlineAreas.find((area) => area.id === state.selectedAreaId)?.title}</p>
 <p className="area-details">Created: {state.offlineAreas.find((area) => area.id === state.selectedAreaId)?.created.toLocaleDateString()}</p>
 </div>
 )}
 {state.errorMessage && (
 <div className="error-container">
 <div className="flex-container">
 <p className="error-text">{state.errorMessage}</p>
 <button
 onClick={() => setState((prev) => ({ ...prev, errorMessage: null }))}
 className="error-close-button"
 >
 <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>
 )}
 {state.loading ? (
 <div className="spinner">
 <div className="spinner-circle"></div>
 </div>
 ) : (
 <div className="package-list">
 {state.selectedAreaPackages.length === 0 ? (
 <p className="no-areas-text">No packages found for this area</p>
 ) : (
 state.selectedAreaPackages.map((pkg) => (
 <div key={pkg.id} className="package-item">
 <div className="flex-container">
 <div className="flex-1 min-w-0">
 <p className="package-title">{pkg.title}</p>
 <p className="package-details">
 {pkg.type} • {pkg.created.toLocaleDateString()}
 {pkg.size && ` • ${(pkg.size / 1024 / 1024).toFixed(1)} MB`}
 </p>
 </div>
 <button
 onClick={() => refreshPackage(pkg.id)}
 disabled={state.loading}
 className="refresh-button"
 title="Refresh package"
 >
 <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
 />
 </svg>
 </button>
 </div>
 </div>
 ))
 )}
 </div>
 )}
 </div>
 ) : state.currentView === "list" ? (
 <div className="offline-map-area-widget">
 <div className="flex-container">
 <h2 className="widget-title">Offline Areas</h2>
 </div>
 {state.selectedMapTitle && (
 <div className="mb-4">
 <p className="select-label">Current Map: {state.selectedMapTitle}</p>
 </div>
 )}
 {state.errorMessage && (
 <div className="error-container">
 <div className="flex-container">
 <p className="error-text">{state.errorMessage}</p>
 <button
 onClick={() => setState((prev) => ({ ...prev, errorMessage: null }))}
 className="error-close-button"
 >
 <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>
 )}
 {state.loading ? (
 <div className="spinner">
 <div className="spinner-circle"></div>
 </div>
 ) : (
 <>
 <div className="area-list">
 {state.offlineAreas.length === 0 ? (
 <p className="no-areas-text">No offline areas created yet</p>
 ) : (
 state.offlineAreas.map((area) => (
 <div key={area.id} className="area-item">
 <div className="flex-1 min-w-0">
 <p className="area-title">{area.title}</p>
 <p className="area-details">
 Created: {area.created.toLocaleDateString()} • Owner: {area.owner}
 </p>
 </div>
 <div className="flex-gap-1">
 {area.status === 'complete' ? null : (
 <button
 disabled
 className={`action-button status ${area.status === 'failed' ? 'bg-red-500' : 'bg-green-500'}`}
 title={`Status: ${area.status}`}
 >
 {area.status === 'failed' ? 'Failed' : 'Packaging'}
 </button>
 )}
 <button
 onClick={() => loadAreaPackages(area.id)}
 className="action-button view"
 title="View packages"
 >
 <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
 </svg>
 </button>
 <button
 onClick={() => removeArea(area.id)}
 className="action-button remove"
 title="Remove area"
 >
 <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path
 strokeLinecap="round"
 strokeLinejoin="round"
 strokeWidth={2}
 d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
 />
 </svg>
 </button>
 </div>
 </div>
 ))
 )}
 </div>
 <div className="flex-gap-2">
 <button onClick={goToCreateView} className="btn-primary">
 Create New Area
 </button>
 {state.offlineAreas.length > 0 && (
 <button
 onClick={() => setState((prev) => ({ ...prev, createdAreas: [], offlineAreas: [], selectedAreaId: null }))}
 className="btn-secondary red"
 title="Clear all areas"
 >
 Clear All
 </button>
 )}
 </div>
 </>
 )}
 </div>
 ) : (
 <div className="offline-map-area-widget">
 <div className="flex-container">
 <button onClick={goBackToList} className="back-button">
 <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
 </svg>
 Back
 </button>
 <h2 className="widget-title">Create Offline Area</h2>
 </div>
 {state.errorMessage && (
 <div className="error-container">
 <div className="flex-container">
 <p className="error-text">{state.errorMessage}</p>
 <button
 onClick={() => setState((prev) => ({ ...prev, errorMessage: null }))}
 className="error-close-button"
 >
 <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
 </svg>
 </button>
 </div>
 </div>
 )}
 {!state.isMapReady && (
 <div className="notification-container yellow">
 <p className="notification-text yellow">Loading map, please wait...</p>
 </div>
 )}
 <div className="space-y-4">
 <div>
 <label htmlFor="areaName" className="select-label">
 Area Name
 </label>
 <input
 type="text"
 id="areaName"
 value={state.areaName}
 onChange={(e) => setState((prev) => ({ ...prev, areaName: e.target.value }))}
 placeholder="Enter a name for your area"
 className="input-field"
 />
 </div>
 {state.selectedMapTitle && (
 <div>
 <p className="select-label">Current Map: {state.selectedMapTitle}</p>
 </div>
 )}
 <div>
 <label className="select-label">Select Draw Mode</label>
 <div className="flex-gap-2">
 <button
 onClick={() => startDrawing("polygon")}
 disabled={state.drawingMode === "polygon" || !state.isMapReady || state.drawnGeometry}
 className={`draw-mode-button ${state.drawingMode === "polygon" ? "active" : state.isMapReady && !state.drawnGeometry ? "inactive" : ""}`}
 >
 ● Polygon
 </button>
 <button
 onClick={() => startDrawing("rectangle")}
 disabled={state.drawingMode === "rectangle" || !state.isMapReady || state.drawnGeometry}
 className={`draw-mode-button ${state.drawingMode === "rectangle" ? "active" : state.isMapReady && !state.drawnGeometry ? "inactive" : ""}`}
 >
 ■ Rectangle
 </button>
 <button
 onClick={clearCurrentDrawing}
 disabled={!state.drawnGeometry && !state.drawingMode}
 className="btn-secondary"
 >
 Clear
 </button>
 </div>
 </div>
 {state.drawingMode && (
 <div className="notification-container yellow">
 <p className="notification-text yellow">
 Drawing {state.drawingMode} mode active. Draw on the map to create your offline area.
 </p>
 </div>
 )}
 {state.drawnGeometry && (
 <div className="notification-container green">
 <p className="notification-text green">
 ✓ Geometry created successfully. Click Save to create the offline area or Clear to start over.
 </p>
 </div>
 )}
 {state.createdAreas.length > 0 && (
 <div className="notification-container blue">
 <p className="notification-text blue">
 {state.createdAreas.length} area(s) created in this session. All areas will be preserved.
 </p>
 </div>
 )}
 <div className="flex-gap-2 pt-2">
 <button
 onClick={saveOfflineArea}
 disabled={!state.drawnGeometry || !state.areaName.trim() || state.loading}
 className="btn-primary"
 >
 {state.loading ? (
 <span className="flex items-center justify-center">
 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
 Saving...
 </span>
 ) : (
 "Save"
 )}
 </button>
 <button
 onClick={goBackToList}
 className="btn-secondary"
 >
 Cancel
 </button>
 </div>
 </div>
 </div>
 )}
 </>
 );
}