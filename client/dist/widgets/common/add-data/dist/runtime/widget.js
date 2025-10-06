System.register(["jimu-core","jimu-ui","jimu-ui/basic/item-selector","jimu-ui/basic/copy-button","jimu-theme"],(function(e,t){var a={},o={},r={},i={},n={};return{setters:[function(e){a.BaseVersionManager=e.BaseVersionManager,a.DataSourceManager=e.DataSourceManager,a.DataSourceStatus=e.DataSourceStatus,a.DataSourceTypes=e.DataSourceTypes,a.DataSourcesChangeMessage=e.DataSourcesChangeMessage,a.DataSourcesChangeType=e.DataSourcesChangeType,a.Immutable=e.Immutable,a.MessageManager=e.MessageManager,a.MutableStoreManager=e.MutableStoreManager,a.React=e.React,a.ReactRedux=e.ReactRedux,a.ServiceManager=e.ServiceManager,a.SupportedItemTypes=e.SupportedItemTypes,a.SupportedLayerServiceTypes=e.SupportedLayerServiceTypes,a.WidgetState=e.WidgetState,a.classNames=e.classNames,a.css=e.css,a.dataSourceUtils=e.dataSourceUtils,a.defaultMessages=e.defaultMessages,a.esri=e.esri,a.focusElementInKeyboardMode=e.focusElementInKeyboardMode,a.getAppStore=e.getAppStore,a.hooks=e.hooks,a.i18n=e.i18n,a.indexedDBUtils=e.indexedDBUtils,a.jsx=e.jsx,a.loadArcGISJSAPIModule=e.loadArcGISJSAPIModule,a.loadArcGISJSAPIModules=e.loadArcGISJSAPIModules,a.polished=e.polished,a.requestUtils=e.requestUtils,a.utils=e.utils,a.uuidv1=e.uuidv1},function(e){o.Alert=e.Alert,o.Button=e.Button,o.CollapsablePanel=e.CollapsablePanel,o.DataActionList=e.DataActionList,o.DataActionListStyle=e.DataActionListStyle,o.Dropdown=e.Dropdown,o.DropdownButton=e.DropdownButton,o.DropdownItem=e.DropdownItem,o.DropdownMenu=e.DropdownMenu,o.FOCUSABLE_CONTAINER_CLASS=e.FOCUSABLE_CONTAINER_CLASS,o.Icon=e.Icon,o.Input=e.Input,o.Label=e.Label,o.Loading=e.Loading,o.LoadingType=e.LoadingType,o.MobilePanel=e.MobilePanel,o.PanelHeader=e.PanelHeader,o.Popper=e.Popper,o.Resizable=e.Resizable,o.Tab=e.Tab,o.Tabs=e.Tabs,o.TextInput=e.TextInput,o.UrlInput=e.UrlInput,o.defaultMessages=e.defaultMessages},function(e){r.ItemCategory=e.ItemCategory,r.ItemSelector=e.ItemSelector,r.ItemSelectorMode=e.ItemSelectorMode},function(e){i.CopyButton=e.CopyButton},function(e){n.useTheme=e.useTheme}],execute:function(){e((()=>{var e={1888:e=>{"use strict";e.exports=n},9044:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M6 6.5a.5.5 0 0 1 1 0v6a.5.5 0 0 1-1 0zM9.5 6a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 1 0v-6a.5.5 0 0 0-.5-.5"></path><path fill="#000" fill-rule="evenodd" d="M11 0H5a1 1 0 0 0-1 1v2H.5a.5.5 0 0 0 0 1h1.6l.81 11.1a1 1 0 0 0 .995.9h8.19a1 1 0 0 0 .995-.9L13.9 4h1.6a.5.5 0 0 0 0-1H12V1a1 1 0 0 0-1-1m0 3V1H5v2zm1.895 1h-9.79l.8 11h8.19z" clip-rule="evenodd"></path></svg>'},10742:e=>{e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxnIG9wYWNpdHk9IjAuOCI+DQo8cGF0aCBkPSJNMyAxOEgyVjExSDNWMTUuMjkzTDUuMjkzIDEzSDYuNzA3TDQuODUgMTQuODU3TDcuMDA2IDE4SDUuNzkzTDQuMTMxIDE1LjU3NkwzIDE2LjcwN1YxOFpNMTYgMTFWMThIMTdWMTFIMTZaTTggMTNWMThIOVYxNUM5IDE0LjczNDggOS4xMDUzNiAxNC40ODA0IDkuMjkyODkgMTQuMjkyOUM5LjQ4MDQzIDE0LjEwNTQgOS43MzQ3OCAxNCAxMCAxNEMxMC4yNjUyIDE0IDEwLjUxOTYgMTQuMTA1NCAxMC43MDcxIDE0LjI5MjlDMTAuODk0NiAxNC40ODA0IDExIDE0LjczNDggMTEgMTVWMThIMTJWMTVDMTIgMTQuNzM0OCAxMi4xMDU0IDE0LjQ4MDQgMTIuMjkyOSAxNC4yOTI5QzEyLjQ4MDQgMTQuMTA1NCAxMi43MzQ4IDE0IDEzIDE0QzEzLjI2NTIgMTQgMTMuNTE5NiAxNC4xMDU0IDEzLjcwNzEgMTQuMjkyOUMxMy44OTQ2IDE0LjQ4MDQgMTQgMTQuNzM0OCAxNCAxNVYxOEgxNVYxNUMxNS4wMDIxIDE0LjU5MjcgMTQuODc5MiAxNC4xOTQ1IDE0LjY0NzkgMTMuODU5MkMxNC40MTY2IDEzLjUyMzkgMTQuMDg4IDEzLjI2NzcgMTMuNzA2NSAxMy4xMjVDMTMuMzI1IDEyLjk4MjMgMTIuOTA4OCAxMi45NiAxMi41MTQzIDEzLjA2MTNDMTIuMTE5NyAxMy4xNjI1IDExLjc2NTcgMTMuMzgyMyAxMS41IDEzLjY5MUMxMS4xOTk3IDEzLjMzNzIgMTAuNzgzNiAxMy4xMDE1IDEwLjMyNTggMTMuMDI1OUM5Ljg2NzkzIDEyLjk1MDMgOS4zOTgxMSAxMy4wMzk2IDkgMTMuMjc4VjEzSDhaTTIxIDYuNzA5VjIzSDNWMTlINFYyMkgyMFY4SDE0VjJINFYxMEgzVjFIMTUuMjlMMjEgNi43MDlaTTIwIDYuOEwxNS4yIDJIMTVWN0gyMFY2LjhaIiBmaWxsPSIjMDc2RkU1Ii8+DQo8L2c+DQo8L3N2Zz4NCg=="},12046:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M11.227 1.312c-.404-.404-1.045-.417-1.432-.03L2.49 8.587l-.48 2.674a.637.637 0 0 0 .73.73l2.673-.48 7.305-7.306c.387-.387.374-1.028-.03-1.431zm-8.114 9.575.32-1.781 4.991-4.992 1.462 1.462-4.992 4.991zm7.473-6.012 1.402-1.4-1.462-1.463-1.401 1.402z" clip-rule="evenodd"></path><path fill="#000" d="M1.5 14a.5.5 0 0 0 0 1h13a.5.5 0 0 0 0-1z"></path></svg>'},14321:e=>{"use strict";e.exports=o},23662:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="M7.5 0a.5.5 0 0 0-.5.5V7H.5a.5.5 0 0 0 0 1H7v6.5a.5.5 0 0 0 1 0V8h6.5a.5.5 0 0 0 0-1H8V.5a.5.5 0 0 0-.5-.5"></path></svg>'},26356:e=>{e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxnIG9wYWNpdHk9IjAuOCI+DQo8cGF0aCBkPSJNMTUuMjkgMUgzVjIzSDIxVjYuNzA5TDE1LjI5IDFaTTIwIDIySDRWMkgxNFY4SDIwVjIyWk0yMCA3SDE1VjJIMTUuMkwyMCA2LjhWN1pNMTQgMTFIMTBWMTBIN1YxM0g4VjE3SDdWMjBIMTBWMTlIMTRWMjBIMTdWMTdIMTZWMTNIMTdWMTBIMTRWMTFaTTE2IDExVjEySDE1VjExSDE2Wk04IDExSDlWMTJIOFYxMVpNOSAxOUg4VjE4SDlWMTlaTTE2IDE5SDE1VjE4SDE2VjE5Wk0xNSAxN0gxNFYxOEgxMFYxN0g5VjEzSDEwVjEySDE0VjEzSDE1VjE3WiIgZmlsbD0iIzA3NkZFNSIvPg0KPC9nPg0KPC9zdmc+DQo="},30655:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M2.146 4.653a.485.485 0 0 1 .708 0L8 10.24l5.146-5.587a.485.485 0 0 1 .708 0 .54.54 0 0 1 0 .738l-5.5 5.956a.485.485 0 0 1-.708 0l-5.5-5.956a.54.54 0 0 1 0-.738" clip-rule="evenodd"></path></svg>'},39524:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M7.5 1.5a.5.5 0 0 1 1 0v2.8a.5.5 0 0 1-1 0zm6.028.874a.5.5 0 0 1 .062.705l-1.414 1.685a.5.5 0 1 1-.766-.643l1.414-1.685a.5.5 0 0 1 .704-.062m-10.352.062a.5.5 0 1 0-.766.643l1.414 1.685a.5.5 0 0 0 .766-.643zM6.244 10.6H5.43zM.961 9.8h4.88c.211 0 .359.19.359.4q0 .207.045.4a1.8 1.8 0 0 0 3.51 0h.814a2.6 2.6 0 0 1-5.139 0H.8v3.6h14.4v-3.6H9.755q.045-.194.045-.4c0-.21.148-.4.358-.4h4.881l-2.267-3.4H3.228zm11.81-4.2a.8.8 0 0 1 .666.356l2.429 3.642a.8.8 0 0 1 .134.444V14.2a.8.8 0 0 1-.8.8H.8a.8.8 0 0 1-.8-.8v-4.158a.8.8 0 0 1 .134-.444l2.429-3.642a.8.8 0 0 1 .665-.356z" clip-rule="evenodd"></path></svg>'},48407:e=>{"use strict";e.exports=i},56340:e=>{"use strict";e.exports=r},62838:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" d="m8.745 8 6.1 6.1a.527.527 0 1 1-.745.746L8 8.746l-6.1 6.1a.527.527 0 1 1-.746-.746l6.1-6.1-6.1-6.1a.527.527 0 0 1 .746-.746l6.1 6.1 6.1-6.1a.527.527 0 0 1 .746.746z"></path></svg>'},78791:e=>{e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTMiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxMyAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIG9wYWNpdHk9IjAuNiIgZD0iTTkuNCAwSDBWMTZIMTNWMy42TDkuNCAwWk0xMiAxNUgxVjFIOFY1SDEyVjE1Wk0xMiA0SDlWMUg5LjMxTDEyIDMuNjlWNFoiIGZpbGw9IiMwNzZGRTUiLz4NCjwvc3ZnPg0K"},79244:e=>{"use strict";e.exports=a},94064:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16"><path fill="#000" fill-rule="evenodd" d="M13.854 11.347a.486.486 0 0 1-.708 0L8 5.76l-5.146 5.587a.485.485 0 0 1-.708 0 .54.54 0 0 1 0-.738l5.5-5.956a.485.485 0 0 1 .708 0l5.5 5.956a.54.54 0 0 1 0 .738" clip-rule="evenodd"></path></svg>'},97863:e=>{e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMjcuMDAwMSAxMy4wMThWOS42OTlMMTkuMzAwMSAySDUuMDAwMDdWMTMuMDE4SDIuMDE4MDdWMjcuOTgySDUuMDAwMDdWMzBIMjcuMDAwMVYyNy45ODJIMjkuOTgyMVYxMy4wMThIMjcuMDAwMVpNMTkuMDAwMSAzTDI2LjAwMDEgMTBIMTkuMDAwMVYzWk02LjAwMDA3IDNIMTguMDAwMVYxMUgyNi4wMDAxVjEzLjAxOEg2LjAwMDA3VjNaTTI2LjAwMDEgMjlINi4wMDAwN1YyNy45ODJIMjYuMDAwMVYyOVpNMjkuMDE4MSAyNy4wMThIMi45ODIwN1YxMy45ODJIMjkuMDE4MVYyNy4wMThaTTguODUwMDcgMjMuMjY4QzguMDIxOTEgMjIuNDcwMiA3LjY4OTEzIDIxLjI4NzQgNy45Nzk4MiAyMC4xNzQ5QzguMjcwNTEgMTkuMDYyMyA5LjEzOTM2IDE4LjE5MzQgMTAuMjUxOSAxNy45MDI4QzExLjM2NDUgMTcuNjEyMSAxMi41NDczIDE3Ljk0NDggMTMuMzQ1MSAxOC43NzNMMTIuNjM4MSAxOS40OEMxMi4wODg4IDE4LjkyMzQgMTEuMjgzMyAxOC43MDM4IDEwLjUyNzUgMTguOTA0NkM5Ljc3MTc2IDE5LjEwNTQgOS4xODE1MyAxOS42OTU4IDguOTgwOTcgMjAuNDUxN0M4Ljc4MDQgMjEuMjA3NSA5LjAwMDI2IDIyLjAxMjkgOS41NTcwNyAyMi41NjJDMTAuNDE4NyAyMy4zODU0IDExLjc3NTUgMjMuMzg1NCAxMi42MzcxIDIyLjU2MkwxMy4zNDUxIDIzLjI2OUMxMi43NDkyIDIzLjg2NTQgMTEuOTQwNyAyNC4yMDA1IDExLjA5NzYgMjQuMjAwNUMxMC4yNTQ1IDI0LjIwMDUgOS40NDU5NSAyMy44NjQ0IDguODUwMDcgMjMuMjY4Wk0yMi4wNDAxIDIzLjk4NEwxOS42NjYxIDE4SDIwLjc0MjFMMjIuNTEwMSAyMi40NTNMMjQuMzA0MSAxOEgyNS4zODIxTDIyLjk3MDEgMjMuOTg2TDIyLjA0MDEgMjMuOTg0Wk0xNy45NjYxIDIyLjQ2MUMxOC4wNTA4IDIyLjIzNzYgMTguMDM1OCAyMS45ODg3IDE3LjkyNTEgMjEuNzc3QzE3LjY4OTIgMjEuNDk0IDE3LjM0NjggMjEuMzIxNCAxNi45NzkxIDIxLjNDMTUuNjkwMSAyMS4xMDIgMTUuMDI2MSAyMC41MTYgMTUuMDA1MSAxOS41NTdDMTQuOTk2NCAxOS4xMDg2IDE1LjE2OTUgMTguNjc1NyAxNS40ODUxIDE4LjM1N0MxNS44MjUxIDE4LjAwMjkgMTYuMjk0MiAxNy44MDE5IDE2Ljc4NTEgMTcuOEMxNy41NzU1IDE3Ljc4MiAxOC4zMDk2IDE4LjIwNzMgMTguNjg3MSAxOC45MDJMMTcuODM2MSAxOS40MjhDMTcuNjQwOCAxOS4wMjk2IDE3LjIyOTQgMTguNzgzNiAxNi43ODYxIDE4LjhDMTYuNTY2OCAxOC44IDE2LjM1NzEgMTguODkgMTYuMjA2MSAxOS4wNDlDMTYuMDc3OCAxOS4xNzQyIDE2LjAwNTQgMTkuMzQ1OCAxNi4wMDUxIDE5LjUyNUMxNi4wMDkxIDE5LjczMSAxNi4wMTkxIDIwLjE0MSAxNy4xMzExIDIwLjMxMUMxNy43OTgyIDIwLjM1OTQgMTguNDA2NyAyMC43MSAxOC43ODMxIDIxLjI2M0MxOS4wNDc2IDIxLjcyOTggMTkuMDkzNiAyMi4yODkyIDE4LjkwOTEgMjIuNzkzQzE4LjU1ODIgMjMuNjMyNyAxNy43MTM0IDI0LjE1NzYgMTYuODA1MSAyNC4xQzE1LjkxMDMgMjQuMTM1OSAxNS4wNzQ4IDIzLjY1MzIgMTQuNjU5MSAyMi44NkwxNS41MjMxIDIyLjM1NUMxNS43NjE2IDIyLjgzODcgMTYuMjY2OCAyMy4xMzIzIDE2LjgwNTEgMjMuMUMxNy4yODcyIDIzLjE0ODcgMTcuNzQ5MSAyMi44OTM4IDE3Ljk2NTEgMjIuNDZMMTcuOTY2MSAyMi40NjFaTTQuNTAwMDcgMjMuNUM0LjUwMDA3IDIyLjk0NzcgNC45NDc3OCAyMi41IDUuNTAwMDcgMjIuNUM2LjA1MjM1IDIyLjUgNi41MDAwNyAyMi45NDc3IDYuNTAwMDcgMjMuNUM2LjUwMDA3IDI0LjA1MjMgNi4wNTIzNSAyNC41IDUuNTAwMDcgMjQuNUM0Ljk0ODI0IDI0LjQ5ODkgNC41MDExNyAyNC4wNTE4IDQuNTAwMDcgMjMuNVoiIGZpbGw9IiMwNzZGRTUiLz4NCjwvc3ZnPg0K"}},t={};function l(a){var o=t[a];if(void 0!==o)return o.exports;var r=t[a]={exports:{}};return e[a](r,r.exports,l),r.exports}l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var a in t)l.o(t,a)&&!l.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),l.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},l.p="";var s={};return l.p=window.jimuConfig.baseUrl,(()=>{"use strict";l.r(s),l.d(s,{__set_webpack_public_path__:()=>ut,default:()=>dt});var e=l(79244),t=l(14321),a=l(39524),o=l.n(a),r=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const i=t=>{const a=window.SVG,{className:i}=t,n=r(t,["className"]),l=(0,e.classNames)("jimu-icon jimu-icon-component",i);return a?e.React.createElement(a,Object.assign({className:l,src:o()},n)):e.React.createElement("svg",Object.assign({className:l},n))},n={_widgetLabel:"Add Data",urlType:"Type",arcgisUrl:"ArcGIS Server Web Service",csvUrl:"CSV Layer",geojsonUrl:"GeoJSON Layer",kmlUrl:"KML Layer",wfsUrl:"WFS OGC Web Service",wmsUrl:"WMS OGC Web Service",wmtsUrl:"WMTS OGC Web Service",dropOrBrowse:"Drop or browse",defaultPlaceholderText:"There is currently no added data.",dropOrBrowseToUpload:"Drop or browse to upload",upload:"Upload",notSupportedFileTypeError:"The file type of {fileName} is not supported.",failedToUploadError:"The file {fileName} cannot be successfully uploaded.",exceedMaxSizeError:"The file size of {fileName} exceeds the maximum limit.",exceedMaxRecordsError:"The number of records in {fileName} exceeds the maximum threshold.",exceedMaxFileNumberError:"The number of files exceeds the allowed limit.",cannotBeAddedError:"{layerName} cannot be added. Support for adding this type is not yet available.",supportedTypesHint:"Supported formats: Shapefile, CSV, KML, GeoJSON, GPX.",fileIsUploading:"{fileName} is being uploaded",filesAreUploading:"{number} files are being uploaded",clickToAddData:"Click to add data",sampleUrl:"Sample URL",fileHasNoValidData:"The file {fileName} does not contain any valid data.",multiFilesNotSupportedFileTypeError:"Unsupported type: The file type for {number} file(s) is not supported.",multiFilesFailedToUploadError:"Upload failed: Unable to upload {number} file(s).",multiFilesExceedMaxRecordsError:"Too many records: The limit for {number} file(s) has been exceeded.",multiFilesExceedMaxSizeError:"File size too large: The limit of {number} file(s) has been exceeded.",multiFilesHasNoValidData:"Invalid data: No valid data found for {number} file(s)."};var d=function(e,t,a,o){return new(a||(a=Promise))((function(r,i){function n(e){try{s(o.next(e))}catch(e){i(e)}}function l(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(n,l)}s((o=o.apply(e,t||[])).next())}))};function c(t){return e.DataSourceManager.getInstance().getDataSource(t)}function u(t,a,o){const r=new e.DataSourcesChangeMessage(t,a,o);e.MessageManager.getInstance().publishMessage(r)}function p(t,a){return d(this,arguments,void 0,(function*(t,a,o=!0){if(!t||0===t.length)return Promise.resolve([]);let r,i,n,l;if(t.some((e=>e.restLayer))){const t=yield(0,e.loadArcGISJSAPIModules)(["esri/layers/FeatureLayer","esri/Graphic","esri/layers/support/Field","esri/renderers/support/jsonUtils"]);r=t[0],i=t[1],n=t[2],l=t[3]}const s=t.map((t=>{var a,o,s,d,c,u,p;if(t.restLayer&&r&&i&&n&&l){const m=null===(o=null===(a=t.restLayer.layerDefinition)||void 0===a?void 0:a.drawingInfo)||void 0===o?void 0:o.renderer;return{id:t.dataSourceJson.id,dataSourceJson:(0,e.Immutable)(t.dataSourceJson),layer:new r({source:(null===(d=null===(s=t.restLayer.featureSet)||void 0===s?void 0:s.features)||void 0===d?void 0:d.map((e=>i.fromJSON(e))))||[],objectIdField:null===(c=t.restLayer.layerDefinition)||void 0===c?void 0:c.objectIdField,fields:null===(p=null===(u=t.restLayer.layerDefinition)||void 0===u?void 0:u.fields)||void 0===p?void 0:p.map((e=>n.fromJSON(e))),sourceJSON:t.restLayer.layerDefinition,title:t.dataSourceJson.label||t.dataSourceJson.sourceLabel,renderer:m?l.fromJSON(m):void 0})}}return{id:t.dataSourceJson.id,dataSourceJson:(0,e.Immutable)(t.dataSourceJson)}}));return yield Promise.allSettled(s.filter((e=>e.layer)).map((e=>d(this,void 0,void 0,(function*(){var t;const a=null===(t=e.layer.sourceJSON)||void 0===t?void 0:t.capabilities;a&&(yield e.layer.load(),e.layer.sourceJSON.capabilities=a)}))))),Promise.allSettled(s.map((t=>e.DataSourceManager.getInstance().createDataSource(t).then((e=>e.isDataSourceSet()&&!e.areChildDataSourcesCreated()?e.childDataSourcesReady().then((()=>e)):e))))).then((e=>e.filter((e=>"fulfilled"===e.status)).map((e=>e.value)))).then((r=>(o&&r.length>0&&u(a,e.DataSourcesChangeType.Create,r),r.length<t.length?Promise.reject(new Error("Failed to create some data source.")):r)))}))}function m(e){var t;e.stopPropagation(),e.preventDefault(),null===(t=e.nativeEvent)||void 0===t||t.stopImmediatePropagation()}function g(t){const a=e.React.useRef(),o=e.React.useRef();return Object.is(o.current,t)||(a.current=o.current,o.current=t),a.current}function M(e,t){return`add-data-${e}-${t}-${(new Date).getTime()}`}function y(t,a){return d(this,void 0,void 0,(function*(){var o,r,i,n;if(1===((null==a?void 0:a.layers)||[]).concat((null==a?void 0:a.tables)||[]).length&&(1===(null===(o=null==a?void 0:a.layers)||void 0===o?void 0:o.length)&&(null===(i=null===(r=null==a?void 0:a.layers)||void 0===r?void 0:r[0])||void 0===i?void 0:i.type)===e.SupportedLayerServiceTypes.FeatureLayer||1===(null===(n=null==a?void 0:a.tables)||void 0===n?void 0:n.length))){const o=function(e,t){var a;return`${e}/${(null===(a=((null==t?void 0:t.layers)||[]).concat((null==t?void 0:t.tables)||[])[0])||void 0===a?void 0:a.id)||0}`}(t,a);return{url:o,layerDefinition:yield e.ServiceManager.getInstance().fetchServiceInfo(o).then((e=>e.definition))}}return null}))}var x=l(23662),f=l.n(x),v=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const S=t=>{const a=window.SVG,{className:o}=t,r=v(t,["className"]),i=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:i,src:f()},r)):e.React.createElement("svg",Object.assign({className:i},r))};var h=l(56340);const j=()=>[{type:h.ItemCategory.MyContent,customLabel:"",enabled:!0,id:h.ItemCategory.MyContent},{type:h.ItemCategory.MyGroup,customLabel:"",enabled:!0,id:h.ItemCategory.MyGroup},{type:h.ItemCategory.MyOrganization,customLabel:"",enabled:!0,id:h.ItemCategory.MyOrganization},{type:h.ItemCategory.Public,customLabel:"",enabled:!0,id:h.ItemCategory.Public},{type:h.ItemCategory.LivingAtlas,customLabel:"",enabled:!0,id:h.ItemCategory.LivingAtlas}],I=t=>{const a=(e=>new Map([[h.ItemCategory.MyContent,e("myContent")],[h.ItemCategory.MyGroup,e("myGroup")],[h.ItemCategory.MyOrganization,e("myOrganization")],[h.ItemCategory.Public,e("public")],[h.ItemCategory.LivingAtlas,e("livingAtlas")],[h.ItemCategory.Curated,e("curated")]]))(t);return e.React.useCallback((e=>{var t;const o=a.get(e.type);if(e.type!==h.ItemCategory.Curated)return o;const r=Number(null===(t=e.id.split("_"))||void 0===t?void 0:t.pop());return!r||r<2?o:`${o} ${r}`}),[a])};var b=function(e,t,a,o){return new(a||(a=Promise))((function(r,i){function n(e){try{s(o.next(e))}catch(e){i(e)}}function l(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(n,l)}s((o=o.apply(e,t||[])).next())}))};const D=e.dataSourceUtils.dataSourceJsonCreator,{useMemo:N,useState:w}=e.React,{useSelector:T}=e.ReactRedux,O=(0,e.Immutable)([e.SupportedItemTypes.FeatureService,e.SupportedItemTypes.MapService,e.SupportedItemTypes.SceneService,e.SupportedItemTypes.FeatureCollection,e.SupportedItemTypes.ImageService,e.SupportedItemTypes.VectorTileService,e.SupportedItemTypes.CSV,e.SupportedItemTypes.GeoJSON,e.SupportedItemTypes.KML,e.SupportedItemTypes.WFS,e.SupportedItemTypes.WMS,e.SupportedItemTypes.WMTS,e.SupportedItemTypes.GroupLayer]),E=a=>{const{className:o="",widgetId:r,multiDataOptions:i,portalUrl:l,nextOrder:s,onChange:d,itemCategoriesInfo:c,displayedItemTypeCategories:u}=a,p=T((e=>e.dataSourcesInfo)),[m,g]=w([]),x=N((()=>(0,e.Immutable)(i.filter((t=>{var a;const o=null===(a=null==p?void 0:p[t.dataSourceJson.id])||void 0===a?void 0:a.instanceStatus;return t.dataSourceJson.itemId&&(!o||o===e.DataSourceStatus.NotCreated)})).map((e=>e.dataSourceJson.itemId)).concat(m))),[i,p,m]),f=N((()=>(0,e.Immutable)(i.map((e=>e.dataSourceJson.itemId)).filter((e=>!x.some((t=>t===e)))))),[i,x]),v=e.hooks.useTranslation(t.defaultMessages,n),S=I(v),j=(()=>{const[t,a]=e.React.useState([]);return e.React.useEffect((()=>{"true"===e.utils.readLocalStorage("restrictEnterpriseOnly")&&a([h.ItemCategory.Public,h.ItemCategory.LivingAtlas])}),[]),t})(),E=N((()=>c?c.filter((e=>e.enabled&&!j.includes(e.type))).map((e=>({id:e.id,type:e.type,customLabel:e.customLabel||S(e),curatedFilter:e.curatedFilter}))).asMutable():void 0),[S,c,j]);return(0,e.jsx)("div",{className:`data-item-search w-100 h-100 ${o}`,css:A},(0,e.jsx)(h.ItemSelector,{mode:h.ItemSelectorMode.Simple,itemType:O,itemTypeCategory:u,portalUrl:l,isMultiple:!0,onSelect:(t,a)=>b(void 0,void 0,void 0,(function*(){if(i.some((e=>{var t;return(null===(t=e.dataSourceJson)||void 0===t?void 0:t.itemId)===a.id})))return;g(m.concat(null==a?void 0:a.id));const t=yield function(t,a){return b(this,void 0,void 0,(function*(){var o,r,i;try{if(!a)return Promise.resolve(null);if(a.type===e.SupportedItemTypes.FeatureService&&a.url&&/^(http(s)?:)?\/\//.test(a.url)){const n=a.url.split("?")[0].replace(/^http:/,"https:").replace(/\/$/,""),l=yield e.ServiceManager.getInstance().fetchServiceInfo(n).then((e=>e.definition));let s,d;const c={itemId:a.id,portalUrl:a.portalUrl};if(e.dataSourceUtils.isSupportedSingleArcGISLayerService(a.url))s=a.url,d=l;else{const e=((null==l?void 0:l.layers)||[]).concat((null==l?void 0:l.tables)||[]),t=yield y(n,l);t&&(s=t.url,d=t.layerDefinition,c.sourceLabel=a.title||(null===(o=e[0])||void 0===o?void 0:o.name))}if(s&&d)return null===(i=null===(r=D.createDataSourceJsonByLayerDefinition(t,d,s))||void 0===r?void 0:r.merge(c))||void 0===i?void 0:i.asMutable({deep:!0})}return Promise.resolve(D.createDataSourceJsonByItemInfo(t,a,a.portalUrl).asMutable({deep:!0}))}catch(e){return console.error("Failed to create data source",e),Promise.resolve(null)}}))}(M(r,s),a);g(m.filter((e=>e!==(null==a?void 0:a.id)))),d(i.concat({dataSourceJson:t,order:s}).filter((e=>!!e.dataSourceJson)))})),onRemove:(e,t)=>{d(i.filter((e=>e.dataSourceJson.itemId!==t.id)))},selectedItems:f,loadingItems:x,itemCategoriesInfo:E,disableDetailPopper:!0,allowAllSceneService:!0,showItemTypeCategoryFilter:!0,enableContentSortInSimpleMode:!0,disableDefaultSortSetting:!0}))};const A=e.css`
  position: relative;
`;var C=l(48407),z=function(e,t,a,o){return new(a||(a=Promise))((function(r,i){function n(e){try{s(o.next(e))}catch(e){i(e)}}function l(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(n,l)}s((o=o.apply(e,t||[])).next())}))};const L=e.dataSourceUtils.dataSourceJsonCreator;var k;!function(e){e.NotSupportedType="addDataErrorNotSupported",e.FailedToFetch="invalidResourceItem",e.CannotBeAdded="cannotBeAddedError"}(k||(k={}));const{useState:U,useMemo:F,useRef:R}=e.React;var P;!function(e){e.ArcGISWebService="arcgisUrl",e.WMS="wmsUrl",e.WMTS="wmtsUrl",e.WFS="wfsUrl",e.KML="kmlUrl",e.CSV="csvUrl",e.GeoJSON="geojsonUrl"}(P||(P={}));const J={[P.ArcGISWebService]:"https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/World_Cities/FeatureServer/0",[P.WMS]:"https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi?service=WMS&request=GetCapabilities",[P.WMTS]:"https://wayback.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/WMTS/1.0.0/default028mm/MapServer/tile/45134/%7Blevel%7D/%7Brow%7D/%7Bcol%7D",[P.WFS]:"https://dservices.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/services/JapanPrefectures2018/WFSServer",[P.KML]:"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month_age_animated.kml",[P.CSV]:"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.csv",[P.GeoJSON]:"https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson"},B=["https"],V=a=>{const{className:o="",widgetId:r,onChange:i,setErrorMsg:l,nextOrder:s,multiDataOptions:d}=a,c=e.hooks.useTranslation(e.defaultMessages,t.defaultMessages,n),[u,p]=U(P.ArcGISWebService),[m,g]=U({value:"",valid:!0}),[x,f]=U(!1),v=R(null),S=F((()=>{const e={};return Object.values(P).forEach((t=>{e[t]=c(t)})),e}),[c]),h=t=>{const a=function(t,a){if(!t||!a)return!0;return a!==P.ArcGISWebService?/^https:\/\//.test(t):e.dataSourceUtils.isSupportedArcGISService(t)||W(t)}(t,u);return{valid:a,msg:!a&&c("invalidUrlMessage")}},j=`add-data-${r}-sample-url-content`;return(0,e.jsx)("div",{className:`data-url-input w-100 h-100 p-4 ${o}`,css:G},(0,e.jsx)("div",null,(0,e.jsx)("div",{className:"url-input-label"},c("urlType")),(0,e.jsx)(t.Dropdown,{className:"w-100",activeIcon:!0,menuRole:"listbox","aria-label":c("urlType")},(0,e.jsx)(t.DropdownButton,{size:"sm",className:"text-left",role:"combobox"},S[u]),(0,e.jsx)(t.DropdownMenu,null,Object.keys(S).map(((a,o)=>(0,e.jsx)(t.DropdownItem,{key:o,active:u===a,onClick:()=>{var e;(e=a)!==u&&(p(e),g({value:"",valid:m.valid}))}},S[a])))))),(0,e.jsx)("div",{className:"mt-4"},(0,e.jsx)("div",{className:"url-input-label"},c("url")),(0,e.jsx)(t.UrlInput,{className:(0,e.classNames)({"with-error":!m.valid}),height:80,schemes:B,value:m.value,checkValidityOnChange:h,checkValidityOnAccept:h,onChange:e=>{g(e)},"aria-label":c("url")})),(0,e.jsx)("div",{className:"mt-4"},(0,e.jsx)(t.Button,{onClick:()=>z(void 0,void 0,void 0,(function*(){var t;const a=null==m?void 0:m.value;if(a)try{f(!0);const t=yield function(t,a,o){return z(this,void 0,void 0,(function*(){return a&&o?(a=a.replace(/^http:/,"https:"),Object.keys(Q).some((e=>e===o))?{id:t,type:Q[o],sourceLabel:a.split("?")[0].split("/").filter((e=>!!e)).reverse()[0],url:a}:o===P.ArcGISWebService?W(a=a.split("?")[0])?function(t,a){return z(this,void 0,void 0,(function*(){if(!t||!a)return Promise.reject(new Error(k.NotSupportedType));const o=t.match(new RegExp("(?<portalUrl>.+)content/items/.+/resources/styles/root.json")).groups.portalUrl,r=t.match(new RegExp(".+/content/items/(?<itemId>.+)/resources/styles/root.json")).groups.itemId,i=yield e.requestUtils.requestWrapper(o,(t=>e.esri.restPortal.getItem(r,{portal:o,authentication:t})));return"Vector Tile Service"!==i.type?Promise.reject(new Error(k.NotSupportedType)):{id:a,type:e.DataSourceTypes.VectorTileService,sourceLabel:i.title,url:t,itemId:r,portalUrl:o.replace("/sharing/rest/","")}}))}(a,t):function(t,a){return z(this,void 0,void 0,(function*(){if(!t||!a)return Promise.reject(new Error(k.NotSupportedType));const o=yield e.ServiceManager.getInstance().fetchServiceInfo(t).then((e=>e.definition));let r=t,i=o;if(e.dataSourceUtils.isSupportedWholeArcGISService(t)&&L.getDataSourceTypeFromArcGISWholeServiceUrl(t)===e.DataSourceTypes.FeatureService){const e=t.split("?")[0].replace(/^http:/,"https:").replace(/\/$/,""),a=yield y(e,o);a&&(r=a.url,i=a.layerDefinition)}return function(e,t,a){var o;const r=null===(o=L.createDataSourceJsonByLayerDefinition(e,a,t))||void 0===o?void 0:o.asMutable({deep:!0});if(r)return r;throw new Error(k.FailedToFetch)}(a,r,i)}))}(a,t):Promise.reject(new Error(k.NotSupportedType))):Promise.reject(new Error("Need URL."))}))}(M(r,s),a,u);if(v.current=t,t.type===e.DataSourceTypes.GroupLayer)throw new Error(k.CannotBeAdded);t&&i(d.concat({dataSourceJson:t,order:s}))}catch(e){e.message===k.NotSupportedType?l(c(k.NotSupportedType)):e.message===k.CannotBeAdded?l(c(k.CannotBeAdded,{layerName:null===(t=v.current)||void 0===t?void 0:t.sourceLabel})):l(c(k.FailedToFetch))}finally{v.current=null,f(!1)}})),type:"primary",disabled:!m.value||!m.valid,className:"px-4 w-100",title:c("add"),"aria-label":c("add")},c("add"))),(0,e.jsx)("div",{className:"mt-4"},(0,e.jsx)("div",{className:"url-input-label mb-1 d-flex align-items-center sample-url-title",role:"group","aria-label":c("sampleUrl")},c("sampleUrl"),(0,e.jsx)(C.CopyButton,{text:J[u],"aria-describedby":j})),(0,e.jsx)("div",{className:"sample-url",id:j},J[u])),x&&(0,e.jsx)("div",{className:"upload-loading-container"},(0,e.jsx)("div",{className:"upload-loading-content"},(0,e.jsx)(t.Loading,{className:"upload-loading",type:t.LoadingType.Primary,width:30,height:28}))))};function W(e){return!(!e||!/^https:\/\//.test(e))&&/\/content\/items\/.+\/resources\/styles\/root.json/.test(e)}const Q={[P.CSV]:e.DataSourceTypes.CSV,[P.GeoJSON]:e.DataSourceTypes.GeoJSON,[P.KML]:e.DataSourceTypes.KML,[P.WFS]:e.DataSourceTypes.WFS,[P.WMS]:e.DataSourceTypes.WMS,[P.WMTS]:e.DataSourceTypes.WMTS};const G=e.css`
  position: relative;
  overflow: auto;

  .upload-loading-container {
    background-color: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
  }
  .upload-loading-content {
    position: absolute;
    top: 0;
    bottom: 60px;
    right: 0;
    left: 0;
  }
  .upload-loading {
    .donut-loading {
      background-color: var(--ref-palette-white);
    }
  }

  .sample-url {
    font-style: italic;
    font-weight: 400;
    font-size: 13px;
    word-break: break-all;
  }

  .url-input.with-error {
    margin-bottom: 60px;
  }
  .url-input-label {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--ref-palette-neutral-1100);
  }
  .sample-url-title {
    justify-content: space-between;
  }
`;var Y,Z=l(1888),$=function(e,t,a,o){return new(a||(a=Promise))((function(r,i){function n(e){try{s(o.next(e))}catch(e){i(e)}}function l(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(n,l)}s((o=o.apply(e,t||[])).next())}))};!function(e){e.CSV="csv",e.GeoJson="geojson",e.Shapefile="shapefile",e.KML="kml",e.GPX="gpx"}(Y||(Y={}));const H={[Y.CSV]:10485760,[Y.GeoJson]:10485760,[Y.Shapefile]:2097152,[Y.KML]:10485760,[Y.GPX]:10485760};var _;!function(e){e.NotSupportedType="notSupportedFileTypeError",e.FailedToUpload="failedToUploadError",e.ExceedMaxSize="exceedMaxSizeError",e.ExceedMaxRecords="exceedMaxRecordsError",e.NoValidData="fileHasNoValidData",e.ExceedMaxFileNumber="exceedMaxFileNumberError"}(_||(_={}));const K=new Map([[_.NotSupportedType,"multiFilesNotSupportedFileTypeError"],[_.FailedToUpload,"multiFilesFailedToUploadError"],[_.ExceedMaxSize,"multiFilesExceedMaxSizeError"],[_.ExceedMaxRecords,"multiFilesExceedMaxRecordsError"],[_.NoValidData,"multiFilesHasNoValidData"]]),q=4e3,{useState:X,useEffect:ee,useMemo:te,useRef:ae}=e.React,oe=/iPad|iPhone|iPod/.test(window.navigator.userAgent)?void 0:Object.values(Y).map((e=>ie(e))).join(","),re=a=>{const{className:o="",onChange:r,setErrorMsg:i,nextOrder:s,portalUrl:d,widgetId:c,multiDataOptions:u}=a,p=e.hooks.useTranslation(e.defaultMessages,n),g=te((()=>`${c}-drag-to-upload`),[c]),y=te((()=>`${c}-click-to-upload`),[c]),[x,f]=X(!1),v=ae(null),h=ae([]);ee((()=>{r(u)}),[u,r]);const j=ae(),I=t=>$(void 0,void 0,void 0,(function*(){var a;if(!t.type)throw new Error(_.NotSupportedType);if(t.size>H[t.type])throw new Error(_.ExceedMaxSize);const o=yield function(t,a){return $(this,void 0,void 0,(function*(){var o,r,i,n,l,s,d,c,u,p,m;const g=yield(0,e.loadArcGISJSAPIModule)("esri/request");if(t.type===Y.KML){const a=function(){var t,a,o;const r=null===(a=null===(t=(0,e.getAppStore)().getState())||void 0===t?void 0:t.portalSelf)||void 0===a?void 0:a.isPortal;if(r){return`${null===(o=(0,e.getAppStore)().getState())||void 0===o?void 0:o.portalUrl}/sharing/kml`}const i=window.jimuConfig.hostEnv;return`https://utility${"dev"===i?"devext":"qa"===i?"qa":""}.arcgis.com/sharing/kml`}(),r=yield function(e){return new Promise((t=>{const a=new FileReader;a.onload=e=>{t(e.target.result)},a.readAsText(e.data.get("file"))}))}(t),i=yield g(a,{query:{kmlString:encodeURIComponent(r),model:"simple",folders:""},responseType:"json"});return null===(o=null==i?void 0:i.data)||void 0===o?void 0:o.featureCollection}let M={};if(t.type!==Y.GPX){if((null===(i=null===(r=(0,e.getAppStore)().getState())||void 0===r?void 0:r.portalSelf)||void 0===i?void 0:i.isPortal)&&t.type===Y.GeoJson)M={targetSR:{wkid:102100,latestWkid:3857},type:t.type,maxRecordCount:q};else{const o=`${a}/sharing/rest/content/features/analyze`;t.data.set("analyzeParameters",JSON.stringify({enableGlobalGeocoding:!0,sourceLocale:null!==(l=null===(n=(0,e.getAppStore)().getState().appContext)||void 0===n?void 0:n.locale)&&void 0!==l?l:"en"}));const r=yield g(o,{body:t.data,method:"post"});t.data.delete("analyzeParameters"),M=null===(s=null==r?void 0:r.data)||void 0===s?void 0:s.publishParameters}}const y=`${a}/sharing/rest/content/features/generate`;t.data.set("publishParameters",JSON.stringify(Object.assign(Object.assign({},M),{name:t.name,maxRecordCount:t.type===Y.CSV?M.maxRecordCount:q})));const x=yield g(y,{body:t.data,method:"post"});return t.data.delete("publishParameters"),(null===(d=null==x?void 0:x.data)||void 0===d?void 0:d.featureCollection)&&(null===(p=null===(u=null===(c=null==x?void 0:x.data)||void 0===c?void 0:c.featureCollection)||void 0===u?void 0:u.layers)||void 0===p||p.forEach((e=>{var a,o,r,i;null===(o=null===(a=e.featureSet)||void 0===a?void 0:a.features)||void 0===o||o.forEach((t=>{var a,o;null===(o=null===(a=e.layerDefinition)||void 0===a?void 0:a.fields)||void 0===o||o.forEach((e=>{var a;const o=null===(a=t.attributes)||void 0===a?void 0:a[e.name];if("esriFieldTypeSmallInteger"===e.type){if("boolean"==typeof o)return void(t.attributes[e.name]=o?1:0);"number"!=typeof o&&(t.attributes[e.name]=null)}}))})),(null===(i=null===(r=e.layerDefinition)||void 0===r?void 0:r.name)||void 0===i?void 0:i.includes(t.name))||(e.layerDefinition.name=`${t.name} - ${e.layerDefinition.name}`)}))),null===(m=null==x?void 0:x.data)||void 0===m?void 0:m.featureCollection}))}(t,d),r=null===(a=null==o?void 0:o.layers)||void 0===a?void 0:a.filter((e=>{var t,a;return(null===(a=null===(t=null==e?void 0:e.featureSet)||void 0===t?void 0:t.features)||void 0===a?void 0:a.length)>0}));if((null==r?void 0:r.length)>0)return r.map(((a,o)=>{var r;return{dataSourceJson:{id:M(c,s+o),type:e.DataSourceTypes.FeatureLayer,sourceLabel:(null===(r=a.layerDefinition)||void 0===r?void 0:r.name)||(0===o?t.name:`${t.name} ${o}`)},order:s+o,restLayer:Object.assign(Object.assign({},a),{layerDefinition:Object.assign(Object.assign({},a.layerDefinition),{capabilities:"Query, Editing, Create, Delete, Update, Extract"})})}}));throw new Error(_.NoValidData)})),[b,D]=X(null),N=t=>$(void 0,void 0,void 0,(function*(){if(!t.target.files)return;f(!0),D(null);let a=[];const o=new Map,n=Array.from(t.target.files);if(n.length>30)o.set(_.ExceedMaxFileNumber,[]);else{const t=n.map((t=>function(t){const a=function(e){return Object.values(Y).find((t=>null==e?void 0:e.endsWith(ie(t))))}(t.name),o=t.name.replace(`.${a}`,""),r=new FormData;return r.set("file",t),r.set("filetype",a),r.set("f","json"),{id:(0,e.uuidv1)(),type:a,name:o,data:r,size:t.size}}(t)));v.current=t,yield Promise.allSettled(t.map((e=>I(e)))).then((e=>{e.forEach(((e,r)=>{var i;const n=t[r];if(h.current.some((e=>e.id===n.id)))h.current=h.current.filter((e=>e.id!==n.id));else if("fulfilled"===e.status)(null===(i=e.value)||void 0===i?void 0:i.length)&&(a=a.concat(e.value));else{const t=(e=>{var t,a,o,r;return e.message===_.NotSupportedType?_.NotSupportedType:e.message===_.ExceedMaxSize||(null===(o=null===(a=null===(t=e.details)||void 0===t?void 0:t.messages)||void 0===a?void 0:a[0])||void 0===o?void 0:o.includes("max size"))?_.ExceedMaxSize:e.message===_.ExceedMaxRecords||(null===(r=e.message)||void 0===r?void 0:r.includes("maximum number"))?_.ExceedMaxRecords:e.message===_.NoValidData?_.NoValidData:_.FailedToUpload})(e.reason);o.set(t,o.has(t)?o.get(t).concat(n.name):[n.name])}}))}))}if((null==a?void 0:a.length)>0&&r(u.concat(a)),o.size>0){const e=Array.from(o.keys()).map((e=>{const t=o.get(e);return t.length?1===t.length&&1===o.size?{errStr:p(e,{fileName:t[0]})}:{errStr:p(K.get(e),{number:t.length}),details:t}:{errStr:p(e)}}));1!==e.length||e[0].details?D(e.map((e=>Object.assign(Object.assign({},e),{open:!0})))):i(e[0].errStr)}f(!1),v.current=null,t.target.value=null}));e.hooks.useUpdateEffect((()=>{!x&&j.current&&(0,e.focusElementInKeyboardMode)(j.current)}),[x]);const[w,T]=X(!1),O=(0,Z.useTheme)(),E=ae(null);ee((()=>{if(null==b?void 0:b.length){const e=setTimeout((()=>{E.current===e&&(D(null),E.current=null)}),5e3);E.current=e}}),[b]);const A=(t=!1)=>{var a,o,r;const i=null===(a=v.current)||void 0===a?void 0:a.length,n=i>1,l=n?"filesAreUploading":"fileIsUploading",s=n?"number":"fileName",d=n?i:null===(r=null===(o=v.current)||void 0===o?void 0:o[0])||void 0===r?void 0:r.name;return p(l,{[s]:!n&&t?(0,e.jsx)("div",{className:"w-100 multiple-lines-truncate font-16"},d):d})},C=`add-data-${c}-supported-types-desc`,z=`add-data-${c}-upload-area-desc`,L=`add-data-${c}-uploading-text-container`;return(0,e.jsx)("div",{className:`data-file-upload w-100 h-100 pb-4 pt-6 px-4 d-flex ${o}`,css:ne},(0,e.jsx)("div",{className:"supported-type-icons d-flex justify-content-around align-items-center px-6 mb-4"},(0,e.jsx)(t.Icon,{width:13,height:16,icon:l(78791)}),(0,e.jsx)(t.Icon,{width:24,height:24,icon:l(26356)}),(0,e.jsx)(t.Icon,{width:32,height:32,icon:l(97863)}),(0,e.jsx)(t.Icon,{width:24,height:24,icon:l(10742)}),(0,e.jsx)(t.Icon,{width:13,height:16,icon:l(78791)})),(0,e.jsx)("div",{className:"supported-types",id:C},p("supportedTypesHint")),(0,e.jsx)("div",{className:"mt-4 drag-area-container"},(0,e.jsx)(t.Label,{for:g,className:"drag-area text-center d-flex"},(0,e.jsx)("div",{className:"font-14",id:z},p("dropOrBrowseToUpload")),(0,e.jsx)("div",{className:"upload-btn-container mt-4",title:p("upload"),"aria-live":"assertive"},(0,e.jsx)(t.Label,{for:y,className:"upload-btn text-center mb-0 text-truncate",css:w?e.css`outline: ${e.polished.rem(2)} solid ${O.sys.color.primary.dark}`:""},(0,e.jsx)(S,{size:15,className:"mr-2"}),(0,e.jsx)("span",null,p("upload"))),(0,e.jsx)("input",{id:y,title:"",className:"upload-btn-file-input",type:"file",accept:oe,onChange:N,tabIndex:x?-1:0,ref:j,multiple:!0,onFocus:()=>{T(!0)},onBlur:()=>{T(!1)},"aria-describedby":`${z} ${C}`}))),(0,e.jsx)(t.Input,{id:g,onClick:m,title:"",className:"drag-area-file-input",type:"file",accept:oe,onChange:N,tabIndex:-1})),x&&(0,e.jsx)("div",{className:"upload-loading-container",title:A(),"aria-live":"assertive"},(0,e.jsx)("div",{className:"upload-loading-content"},(0,e.jsx)(t.Loading,{className:"upload-loading",type:t.LoadingType.Secondary,width:30,height:28}),(0,e.jsx)("div",{className:"upload-loading-file-name d-flex justify-content-center align-items-center"},(0,e.jsx)("div",{className:"w-100 font-14 text-center",id:L},A(!0))),(0,e.jsx)("div",{className:"upload-loading-btn d-flex justify-content-center"},(0,e.jsx)(t.Button,{type:"danger",onClick:()=>{h.current=h.current.concat(v.current),v.current=null,f(!1)},ref:t=>{(0,e.focusElementInKeyboardMode)(t)},"aria-describedby":L},p("cancel"))))),(null==b?void 0:b.length)&&(0,e.jsx)("div",{className:"errors-container"},b.map(((a,o)=>{var r;return(0,e.jsx)(t.Alert,{className:"w-100 mb-2",closable:!0,withIcon:!0,form:"basic",type:"warning",title:a.errStr,open:a.open,key:a.errStr,onClose:()=>{(e=>{const t=[...b];t[e].open=!1,t.every((e=>!e.open))?D(null):D(t)})(o)}},(null===(r=a.details)||void 0===r?void 0:r.length)&&(0,e.jsx)("div",{className:"collapse-panel-container"},(0,e.jsx)(t.CollapsablePanel,{label:p("details")},a.details.map(((t,a)=>(0,e.jsx)("p",{key:a,className:"mb-1"},t))))))}))))};function ie(e){return"shapefile"===e?".zip":`.${e}`}const ne=e.css`
  position: relative;
  flex-direction: column;
  color: var(--ref-palette-neutral-1000);

  .font-14 {
    font-size: 14px;
  }

  .font-16 {
    font-size: 16px;
    font-weight: 500;
  }

  .upload-loading-container {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: var(--ref-palette-white);
    z-index: 2;
  }
  .upload-loading-content {
    position: absolute;
    top: 0;
    bottom: 60px;
    right: 0;
    left: 0;
    .upload-loading {
      top: 180px;
      bottom: calc(50% - 80px);
    }
  }
  .upload-loading-file-name {
    position: absolute;
    width: 200px;
    height: 100px;
    right: calc(50% - 100px);
    top: 80px;
    word-break: break-all;
    overflow: hidden;
  }
  .upload-loading-btn {
    position: absolute;
    width: 200px;
    height: 32px;
    right: calc(50% - 100px);
    top: calc(50% + 80px);
    button.btn-danger {
      background-color: var(--sys-color-error-main);
      border: 0;
    }
  }

  .supported-types {
    font-size: 13px;
  }

  .drag-area-container {
    width: 100%;
    flex: 1
  }
  .drag-area {
    border: 1px dashed var(--ref-palette-neutral-500);
    width: 100%;
    height: 100%;
    user-select: none;
    flex-direction: column;
    justify-content: center;
  }
  .upload-btn {
    border: 1px solid var(--ref-palette-neutral-500);
    color: var(--ref-palette-neutral-1100);
    background-color: var(--ref-palette-white);
    border-radius: 2px;
    line-height: 28px;
    padding-left: 16px;
    padding-right: 16px;
    height: 30px;
    user-select: none;
    max-width: 100%;
  }
  .upload-btn-container {
    line-height: 0;
    width: max-content;
    margin: 0 auto;
  }
  .upload-btn-container:hover {
    .upload-btn {
      background-color: var(--ref-palette-neutral-300) !important;
    }
  }
  .drag-area-container, .upload-btn-container {
    position: relative;
    display: inline-block;
    z-index: 1;
  }
  .upload-btn-file-input, .drag-area-file-input {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    opacity: 0;
  }
  .upload-btn-file-input {
    cursor: pointer;
  }

  .errors-container {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    max-height: 100%;
    overflow-y: auto;
    .jimu-alert-panel-title {
      font-size: 13px;
      font-weight: 400;
    }
    .collapse-label {
      font-size: 13px;
    }
    .collapse-panel-container {
      border-top: 1px solid var(--sys-color-divider-tertiary);
    }
  }

`;var le=l(30655),se=l.n(le),de=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const ce=t=>{const a=window.SVG,{className:o}=t,r=de(t,["className"]),i=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:i,src:se()},r)):e.React.createElement("svg",Object.assign({className:i},r))};var ue=l(94064),pe=l.n(ue),me=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const ge=t=>{const a=window.SVG,{className:o}=t,r=me(t,["className"]),i=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:i,src:pe()},r)):e.React.createElement("svg",Object.assign({className:i},r))};var Me=l(62838),ye=l.n(Me),xe=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const fe=t=>{const a=window.SVG,{className:o}=t,r=xe(t,["className"]),i=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:i,src:ye()},r)):e.React.createElement("svg",Object.assign({className:i},r))},{useState:ve,useEffect:Se}=e.React,{useSelector:he}=e.ReactRedux,je=a=>{const{multiDataOptions:o,widgetId:r,doneButtonRef:i,onFinish:n,onRemove:l,setErrorMsg:s}=a,d=e.hooks.useTranslation(t.defaultMessages),[m,M]=ve(!1),[y,x]=ve(!1),f=g(o);Se((()=>{!function(t,a,o=!0){const r=t.map((e=>c(e))).filter((e=>!!e));o&&r.length>0&&u(a,e.DataSourcesChangeType.Remove,r),Promise.resolve().then((()=>{t.forEach((t=>{e.MutableStoreManager.getInstance().updateStateValue("setFilter",t,null),e.DataSourceManager.getInstance().destroyDataSource(t)}))}))}(((null==f?void 0:f.filter((e=>!o.some((t=>t.dataSourceJson.id===e.dataSourceJson.id)))))||[]).map((e=>e.dataSourceJson.id)),r,!1),x(!0);p(o.filter((e=>!(null==f?void 0:f.some((t=>e.dataSourceJson.id===t.dataSourceJson.id))))),r,!1).catch((e=>{s(d("dataSourceCreateError"))})).finally((()=>{x(!1)}))}),[r,o,f,s,d]);const v=()=>{n(o)},S=d("numSelected",{number:o.length}),h=d(m?"collapse":"expand");return(0,e.jsx)("div",{className:"data-collapse",css:be},o.length>0&&(0,e.jsx)("div",{className:"data-container surface-2 p-4"},(0,e.jsx)("div",{className:"d-flex justify-content-between align-items-center"},(0,e.jsx)("div",{className:"d-flex align-items-center n-selected",role:"group","aria-label":S},(0,e.jsx)("span",{className:"text-truncate",title:S},S),(0,e.jsx)(t.Button,{className:"jimu-outline-inside",type:"tertiary",size:"sm",icon:!0,onClick:()=>{M(!m)},title:h,"aria-label":h,"aria-expanded":m},m?(0,e.jsx)(ce,{size:"s"}):(0,e.jsx)(ge,{size:"s"}))),(0,e.jsx)("div",{className:"small-done-btn"},!m&&(0,e.jsx)(t.Button,{onClick:v,disabled:y,type:"primary",className:"text-truncate w-100 px-2",title:d("done"),ref:i},d("done")))),m&&(0,e.jsx)("div",{className:"data-items",role:"list"},o.map(((t,a)=>(0,e.jsx)(Ie,{key:a,widgetId:r,isLoading:y,onRemove:l,dsJson:(0,e.Immutable)(t.dataSourceJson)})))),m&&(0,e.jsx)("div",{className:"big-done-btn w-100"},(0,e.jsx)(t.Button,{onClick:v,disabled:y,type:"primary",className:"text-truncate w-100",title:d("done"),"aria-label":d("done"),ref:i},d("done")))))};function Ie({widgetId:a,dsJson:o,isLoading:r,onRemove:i}){const n=e.hooks.useTranslation(t.defaultMessages),l=e.i18n.getIntl(),s=c(o.id),d=he((e=>{var t;return null===(t=e.dataSourcesInfo)||void 0===t?void 0:t[o.id]})),u=d?d.instanceStatus===e.DataSourceStatus.CreateError:!s&&!r,p=d?d.instanceStatus===e.DataSourceStatus.NotCreated:!s&&r,m=`add-data-${a}-collapse-panel-list-item-${o.id}`;return(0,e.jsx)("div",{className:"d-flex align-items-center justify-content-between w-100 data-item",role:"listitem"},(0,e.jsx)("div",{className:"d-flex align-items-center flex-grow-1 text-truncate",title:e.dataSourceUtils.getDsTypeString(null==o?void 0:o.type,l)},u&&(0,e.jsx)("div",{className:"d-flex justify-content-center align-items-center flex-shrink-0 data-error"},(0,e.jsx)(t.Alert,{className:"flex-shrink-0",css:e.css`padding-left: 0 !important; padding-right: 0 !important;`,buttonType:"tertiary",form:"tooltip",size:"small",type:"error",text:n("dataSourceCreateError")})),p&&(0,e.jsx)("div",{className:"d-flex justify-content-center align-items-center flex-shrink-0 data-loading"},(0,e.jsx)(t.Loading,{type:t.LoadingType.Donut,width:16,height:16})),!u&&!p&&(0,e.jsx)("div",{className:"d-flex justify-content-center align-items-center flex-shrink-0 data-thumbnail"},(0,e.jsx)(t.Icon,{icon:e.dataSourceUtils.getDsIcon(o),color:"#FFFFFF",size:"12"})),(0,e.jsx)("div",{className:"flex-grow-1 text-truncate pl-2 data-label",title:o.label||o.sourceLabel,id:m},o.label||o.sourceLabel)),(0,e.jsx)("div",{className:"d-flex align-items-center flex-shrink-0"},(0,e.jsx)(t.Button,{className:"jimu-outline-inside",type:"tertiary",size:"sm",icon:!0,onClick:()=>{i(o.id)},title:n("remove"),"aria-label":n("remove"),"aria-describedby":m},(0,e.jsx)(fe,{size:14,color:"var(--ref-palette-neutral-1100)"}))))}const be=e.css`
  .data-container {
    background-color: var(--ref-palette-white);
    position: absolute;
    right: 0;
    left: 0;
    bottom: 0;
    box-shadow: 0px -1px 4px rgba(0, 0, 0, 0.16) !important;
    border: 0 !important;
    z-index: 10;
    .n-selected {
      font-size: 14px;
      max-width: 130px;
    }
    .data-items {
      max-height: 500px;
      overflow-y: auto;
      overflow-x: hidden;
      .data-thumbnail {
        width:  26px;
        height:  26px;
        background-color: #0095DB;
      }
      .data-loading, .data-error {
        position: relative;
        width: 24px;
        height: 24px;
        border: 1px solid #0095DB;
      }
      .data-label {
        font-size: 13px;
        color: var(--ref-palette-neutral-1100);
      }
      .data-item {
        height: 26px;
        margin-bottom: 12px;
      }
    }
    .small-done-btn {
      max-width: 90px;
    }
  }
`,{useState:De,useMemo:Ne,useRef:we,useCallback:Te,useEffect:Oe}=e.React,Ee=["search","url","file"],Ae={width:240,height:600},Ce=a=>{const{portalUrl:o,widgetId:r,buttonSize:i,hiddenTabs:l,popperReference:s,nextOrder:d,onFinish:c,itemCategoriesInfo:u,hidePopper:p,buttonDescribedby:m,displayedItemTypeCategories:g}=a,[M,y]=De(!1),[x,f]=De(null),[v,h]=De([]),[j,I]=De([]),[b,D]=De([]),N=Ne((()=>v.concat(j).concat(b).sort(((e,t)=>e.order-t.order))),[v,j,b]),w=Ne((()=>N.length>0?Math.max(...N.map((e=>e.order)))+1:d),[N,d]),T=Ne((()=>Ee.filter((e=>!(null==l?void 0:l.some((t=>e===t)))))),[l]),O=e.hooks.useTranslation(t.defaultMessages,e.defaultMessages,n),E=we(null),A=e.hooks.useCheckSmallBrowserSizeMode(),C=we();Oe((()=>{"sm"===i&&(0,e.focusElementInKeyboardMode)(C.current)}),[]),Oe((()=>{x&&!E.current&&(E.current=setTimeout((()=>{f(null),E.current=null}),5e3))}),[x]);const z=e=>{v.some((t=>t.dataSourceJson.id===e))&&h(v.filter((t=>t.dataSourceJson.id!==e))),j.some((t=>t.dataSourceJson.id===e))&&I(j.filter((t=>t.dataSourceJson.id!==e))),b.some((t=>t.dataSourceJson.id===e))&&D(b.filter((t=>t.dataSourceJson.id!==e)))},L=e=>{c(e),P()},[k,U]=De(),F=we(null),R=we(null),P=Te((()=>{const t=!M;y(t),t||(h([]),I([]),D([]),C.current&&(0,e.focusElementInKeyboardMode)(C.current)),t&&setTimeout((()=>{var e;const t=document.body.getBoundingClientRect(),a=null===(e=F.current)||void 0===e?void 0:e.getBoundingClientRect();t&&a&&U({left:-a.left,top:0,right:t.width-a.right+Ae.width,bottom:t.height-a.bottom+Ae.height})}),500)}),[M]);Oe((()=>{!A&&p&&M&&P()}),[p]);const J=e.ReactRedux.useSelector((e=>e.appRuntimeInfo.currentPageId));e.hooks.useUpdateEffect((()=>{M&&P()}),[J]);const B=we(null),V=we(null),W=we(null),Q=()=>(0,e.jsx)(Le,{mobile:A,errorMsg:x,translate:O,tabs:T,togglePopper:P,onFinish:L,onRemove:z,portalUrl:o,widgetId:r,nextOrder:w,multiDataOptions:N,multiDataOptionsFromSearch:v,multiDataOptionsFromUrl:j,multiDataOptionsFromFile:b,setErrorMsg:f,setMultiDataOptionsFromSearch:h,setMultiDataOptionsFromUrl:I,setMultiDataOptionsFromFile:D,itemCategoriesInfo:u,containerRef:B,closeButtonRef:V,doneButtonInCollapseRef:W,displayedItemTypeCategories:g});return(0,e.jsx)("div",{className:"add-data-popper",css:ke},"lg"===i&&(0,e.jsx)(t.Button,{type:"primary",className:"flex-grow-1 text-center",onClick:P,"aria-label":O("clickToAddData"),ref:C,title:O("clickToAddData"),"aria-haspopup":"dialog","aria-describedby":m},(0,e.jsx)("div",{className:"w-100 px-2 d-flex align-items-center justify-content-center"},(0,e.jsx)(S,{size:"m",className:"mr-2"}),(0,e.jsx)("div",{className:"text-truncate"},O("clickToAddData")))),"sm"===i&&(0,e.jsx)(t.Button,{type:"primary",className:"d-flex justify-content-center align-items-center small-add-btn",onClick:P,"aria-label":O("clickToAddData"),ref:C,title:O("clickToAddData"),"aria-haspopup":"dialog"},(0,e.jsx)(S,{size:"m",className:"m-0"})),A?(0,e.jsx)(t.MobilePanel,{open:M,onClose:P,title:O("addData")},Q()):(0,e.jsx)(t.Popper,{open:M,toggle:null,reference:s,placement:"right-start",ref:F,css:Ue,"aria-label":O("addData"),forceLatestFocusElements:!0,onKeyDown:t=>{var a,o;if("Escape"===t.key){if(!(null===(a=B.current)||void 0===a?void 0:a.contains(t.target)))return;if(t.target===V.current)P();else{const a=!!(null===(o=t.target)||void 0===o?void 0:o.closest(".data-item-search")),r=N.length>0,i=a&&r&&W.current&&!W.current.disabled?W.current:V.current;(0,e.focusElementInKeyboardMode)(i)}}}},(0,e.jsx)(t.Resizable,{className:t.FOCUSABLE_CONTAINER_CLASS,ref:R,defaultSize:Ae,minSize:Ae,handles:["bottom-left","bottom-right"],bounds:k},Q())))},ze=({tab:t,portalUrl:a,widgetId:o,nextOrder:r,multiDataOptionsFromSearch:i,multiDataOptionsFromUrl:n,multiDataOptionsFromFile:l,setMultiDataOptionsFromSearch:s,setMultiDataOptionsFromUrl:d,setMultiDataOptionsFromFile:c,setErrorMsg:u,itemCategoriesInfo:p,className:m,displayedItemTypeCategories:g})=>"search"===t?(0,e.jsx)(E,{className:m,portalUrl:a,widgetId:o,onChange:s,nextOrder:r,multiDataOptions:i,itemCategoriesInfo:p,displayedItemTypeCategories:g}):"url"===t?(0,e.jsx)(V,{className:m,widgetId:o,onChange:d,nextOrder:r,multiDataOptions:n,setErrorMsg:u}):"file"===t?(0,e.jsx)(re,{className:m,portalUrl:a,widgetId:o,nextOrder:r,onChange:c,multiDataOptions:l,setErrorMsg:u}):void 0,Le=({mobile:a,errorMsg:o,translate:r,tabs:i,togglePopper:n,onFinish:l,onRemove:s,portalUrl:d,widgetId:c,nextOrder:u,multiDataOptions:p,multiDataOptionsFromSearch:m,multiDataOptionsFromUrl:g,multiDataOptionsFromFile:M,setMultiDataOptionsFromSearch:y,setMultiDataOptionsFromUrl:x,setMultiDataOptionsFromFile:f,setErrorMsg:v,itemCategoriesInfo:S,containerRef:h,closeButtonRef:j,doneButtonInCollapseRef:I,displayedItemTypeCategories:b})=>(0,e.jsx)("div",{ref:h,css:e.css`
    width: 100%;
    height: 100%;
    .add-data-popper-content {
      position: relative;
      height: ${p.length?a?"calc(100% - 64px)":"calc(100% - 120px)":a?"100%":"calc(100% - 56px)"};
    }
    .tab-content {
      overflow: hidden;
    }
    .jimu-nav {
      border-bottom: 1px solid var(--ref-palette-neutral-500);
    }
    .multiple-lines-truncate {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      word-break: break-word;
      word-wrap: break-word;
    }
    .item-selector-search {
      .text-input-prefix {
        svg {
          margin-left: 0 !important;
          color: var(--ref-palette-neutral-700) !important;
        }
      }
    }
  `},!a&&(0,e.jsx)(t.PanelHeader,{title:r("addData"),showClose:!0,onClose:n,level:1,className:"p-4",closeButtonRef:j}),(0,e.jsx)("div",{className:"add-data-popper-content"},i.length>1&&(0,e.jsx)(t.Tabs,{type:"underline",className:"w-100 h-100",fill:!0,defaultValue:i[0]},i.map(((a,o)=>(0,e.jsx)(t.Tab,{key:o,id:a,title:r(a)},(0,e.jsx)(ze,{tab:a,portalUrl:d,widgetId:c,nextOrder:u,setErrorMsg:v,multiDataOptionsFromSearch:m,multiDataOptionsFromUrl:g,multiDataOptionsFromFile:M,setMultiDataOptionsFromSearch:y,setMultiDataOptionsFromUrl:x,setMultiDataOptionsFromFile:f,itemCategoriesInfo:S,displayedItemTypeCategories:b}))))),1===i.length&&(0,e.jsx)("div",{className:"w-100 h-100"},(0,e.jsx)(ze,{tab:i[0],portalUrl:d,widgetId:c,nextOrder:u,setErrorMsg:v,multiDataOptionsFromSearch:m,multiDataOptionsFromUrl:g,multiDataOptionsFromFile:M,setMultiDataOptionsFromSearch:y,setMultiDataOptionsFromUrl:x,setMultiDataOptionsFromFile:f,itemCategoriesInfo:S,displayedItemTypeCategories:b})),o&&(0,e.jsx)(t.Alert,{className:"w-100",css:e.css`position: absolute; top: ${1===i.length?0:"33px"}; left: 0; right: 0; z-index: 1;`,closable:!0,form:"basic",onClose:()=>{v(null)},open:!0,text:o,type:"warning",withIcon:!0})),(0,e.jsx)(je,{multiDataOptions:p,widgetId:c,doneButtonRef:I,onFinish:l,onRemove:s,setErrorMsg:v})),ke=e.css`
  .small-add-btn {
    border-radius: 16px;
    width: 32px;
    height: 32px;
    padding: 0;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  }
`,Ue=e.css`
  width: ${Ae.width}px;
  height: ${Ae.height}px;
  border: none;
  box-shadow: none;
  background: none;
  overflow: visible;
  .resizable {
    background: var(--sys-color-surface-overlay);
    border-width: 1px;
    border-style: solid;
    border-color: var(--sys-color-divider-secondary);
    box-shadow: var(--sys-shadow-2);
  }
`;var Fe=l(9044),Re=l.n(Fe),Pe=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const Je=t=>{const a=window.SVG,{className:o}=t,r=Pe(t,["className"]),i=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:i,src:Re()},r)):e.React.createElement("svg",Object.assign({className:i},r))};var Be=l(12046),Ve=l.n(Be),We=function(e,t){var a={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(a[o]=e[o]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(a[o[r]]=e[o[r]])}return a};const Qe=t=>{const a=window.SVG,{className:o}=t,r=We(t,["className"]),i=(0,e.classNames)("jimu-icon jimu-icon-component",o);return a?e.React.createElement(a,Object.assign({className:i,src:Ve()},r)):e.React.createElement("svg",Object.assign({className:i},r))},{useLayoutEffect:Ge,useState:Ye,useRef:Ze,useMemo:$e}=e.React,{useSelector:He}=e.ReactRedux,_e=a=>{const{multiDataOptions:o,enableDataAction:r,isLoading:i,onRemoveData:n,onChangeData:l,widgetId:s,disableRenaming:d}=a,u=e.hooks.useTranslation(t.defaultMessages,e.defaultMessages),[p,m]=Ye(null),M=Ze(null),y=He((e=>e.dataSourcesInfo)),x=g(M),f=e.i18n.getIntl(),v=(0,Z.useTheme)(),S=qe(v);Ge((()=>{p&&M.current&&(null==x?void 0:x.current)!==M.current&&((0,e.focusElementInKeyboardMode)(M.current),M.current.select())}),[M,x,p]);const h=e=>{m((null==p?void 0:p.dataSourceJson.id)===(null==e?void 0:e.dataSourceJson.id)?null:e)};return(0,e.jsx)("ul",{className:"data-list",css:S},o.map(((a,o)=>{var m;const g=c(a.dataSourceJson.id),x=null==y?void 0:y[a.dataSourceJson.id],v=x?x.instanceStatus===e.DataSourceStatus.CreateError:!g&&!i,S=x?x.instanceStatus===e.DataSourceStatus.NotCreated:!g&&i,j=(null==p?void 0:p.dataSourceJson.id)===a.dataSourceJson.id,I=a.dataSourceJson.label||a.dataSourceJson.sourceLabel,b=e.dataSourceUtils.getDsTypeString(null===(m=a.dataSourceJson)||void 0===m?void 0:m.type,f),D=r&&g;return(0,e.jsx)("li",{key:a.dataSourceJson.id,className:(0,e.classNames)("d-flex justify-content-between align-items-center data-item",{"pt-3":0!==o}),"aria-label":`${b} ${I}`,role:"group"},(0,e.jsx)("div",{className:"flex-grow-1 text-truncate d-flex justify-content-start align-items-center"},S&&(0,e.jsx)("div",{className:"flex-shrink-0 d-flex justify-content-center align-items-center mr-1 data-item-loading"},(0,e.jsx)(t.Loading,{type:t.LoadingType.Donut,width:16,height:16})),(0,e.jsx)("div",{className:"flex-grow-1 text-truncate d-flex align-items-center",title:b},!S&&(0,e.jsx)("div",{className:"flex-shrink-0 d-flex justify-content-center align-items-center data-thumbnail"},(0,e.jsx)(t.Icon,{icon:e.dataSourceUtils.getDsIcon((0,e.Immutable)(a.dataSourceJson)),color:"#FFFFFF",size:"12"})),v&&(0,e.jsx)(t.Alert,{className:"flex-shrink-0 ml-2 mr-1",css:e.css`padding-left: 0 !important; padding-right: 0 !important;`,variant:"text",form:"tooltip",size:"small",type:"error",text:u("dataSourceCreateError")}),(0,e.jsx)("div",{className:(0,e.classNames)("flex-grow-1 text-truncate data-label",{"pl-2":!v}),title:p?"":I},j?(0,e.jsx)(t.TextInput,{className:"w-100",size:"sm",defaultValue:I,onAcceptValue:e=>{((e,t)=>{h(e),l(Object.assign(Object.assign({},e),{dataSourceJson:Object.assign(Object.assign({},e.dataSourceJson),{label:t})}))})(a,e)},ref:M}):I))),(0,e.jsx)("div",{className:"flex-shrink-0 d-flex justify-content-end align-items-center data-item-operations"},!d&&!S&&!v&&(0,e.jsx)(t.Button,{className:"jimu-outline-inside",type:"tertiary",size:"sm",icon:!0,title:u("rename"),"aria-label":u("rename"),onClick:()=>{h(a)},onKeyDown:e=>{"Enter"===e.key&&e.preventDefault()},onKeyUp:e=>{var t;t=a,"Enter"===e.key&&h(t)}},(0,e.jsx)(Qe,{size:"m"})),D&&(0,e.jsx)(t.DataActionList,{widgetId:s,dataSets:[{dataSource:g,records:[],name:g.getDataSourceJson().label||g.getDataSourceJson().sourceLabel}],listStyle:t.DataActionListStyle.Dropdown,buttonSize:"sm",buttonType:"tertiary",hideGroupTitle:!0,buttonClassName:"jimu-outline-inside"}),(0,e.jsx)(t.Button,{className:"jimu-outline-inside",type:"tertiary",size:"sm",icon:!0,onClick:()=>{n(a.dataSourceJson.id)},title:u("remove"),"aria-label":u("remove")},(0,e.jsx)(Je,{size:"m"}))))})))},Ke=e.css`
  max-height: calc(100% - 35px);
  overflow: auto;

  margin-bottom: 38px;
  padding-left: 0;

  .data-item {
    width: 100%;
    overflow: hidden;
  }
  .data-item-loading {
    position: relative;
    width: 24px;
    height: 24px;
    border: 1px solid #0095DB;
  }
  .data-thumbnail {
    width:  26px;
    height:  26px;
    background-color: #0095DB;
  }
  .data-label {
    font-size: 13px;
    color: var(--ref-palette-neutral-1100);
  }
`,qe=t=>$e((()=>e.css`
    ${Ke}
    .data-item-operations .data-action-dropdown .data-action-button{
      &:focus,
      &:focus-visible {
        outline-offset: -2px;
      }
      border: 0;
    }
  `),[]);class Xe extends e.BaseVersionManager{constructor(){super(...arguments),this.versions=[{version:"1.12.0",description:"Allow to configure curated filter",upgrader:e=>e.disableAddBySearch||e.itemCategoriesInfo?e:e.set("itemCategoriesInfo",j())}]}}const et=new Xe;var tt=function(e,t,a,o){return new(a||(a=Promise))((function(r,i){function n(e){try{s(o.next(e))}catch(e){i(e)}}function l(e){try{s(o.throw(e))}catch(e){i(e)}}function s(e){var t;e.done?r(e.value):(t=e.value,t instanceof a?t:new a((function(e){e(t)}))).then(n,l)}s((o=o.apply(e,t||[])).next())}))};const{useState:at,useEffect:ot,useMemo:rt,useRef:it,useCallback:nt}=e.React,lt=!window.jimuConfig.isInBuilder,st=a=>{const{portalUrl:o,id:r,enableDataAction:l=!0,config:s,mutableStateProps:m}=a,g=(t=>e.React.useMemo((()=>t.disableAddBySearch||t.itemCategoriesInfo?t.itemCategoriesInfo:(0,e.Immutable)(j())),[t.disableAddBySearch,t.itemCategoriesInfo]))(s),M=rt((()=>(null==m?void 0:m.multiDataOptions)||[]),[null==m?void 0:m.multiDataOptions]),y=nt((t=>{e.MutableStoreManager.getInstance().updateStateValue(r,"multiDataOptions",t)}),[r]),x=e.hooks.useTranslation(t.defaultMessages,n),[f,v]=at(!1),S=rt((()=>{const e=[];return s.disableAddBySearch&&e.push("search"),s.disableAddByUrl&&e.push("url"),s.disableAddByFile&&e.push("file"),e}),[s.disableAddBySearch,s.disableAddByUrl,s.disableAddByFile]),h=rt((()=>M.length>0?Math.max(...M.map((e=>e.order)))+1:0),[M]),I=e.React.useRef(null),b=it(null);ot((()=>(b.current=new e.indexedDBUtils.IndexedDBCache(r,"add-data","added-data"),lt&&b.current.init().then((()=>tt(void 0,void 0,void 0,(function*(){const e=yield b.current.getAll();e.length>0&&(v(!0),p(e,r).catch((e=>{console.error("Failed to create data source",e)})).finally((()=>{v(!1)})),y(e.sort(((e,t)=>e.order-t.order))))})))).catch((e=>{console.error("Failed to read cache.",e)})),()=>{b.current.close()})),[r,y]);const D=e=>{b.current.initialized()&&b.current.putAll(e.map((e=>({key:e.dataSourceJson.id,value:e})))),v(!0),p(e,r).catch((e=>{console.error("Failed to create data source",e)})).finally((()=>{v(!1)})),y(M.concat(e))},N=e.ReactRedux.useSelector((e=>{var t;const a=null==e?void 0:e.widgetsRuntimeInfo;return null===(t=null==a?void 0:a[r])||void 0===t?void 0:t.state})),w=rt((()=>N===e.WidgetState.Closed),[N]),T=`${r}-placeholder`;return(0,e.jsx)("div",{className:"widget-add-data jimu-widget d-flex align-items-center justify-content-center surface-1 border-0",css:ct,ref:I},0===M.length&&(0,e.jsx)("div",{className:"no-data-placeholder w-100"},(0,e.jsx)("div",{className:"no-data-placeholder-icon"},(0,e.jsx)(i,{size:32,color:"var(--ref-palette-neutral-1000)"})),(0,e.jsx)("div",{className:"no-data-placeholder-text",id:T},(0,e.jsx)("span",null,s.placeholderText||x("defaultPlaceholderText"))),(0,e.jsx)("div",{className:"no-data-placeholder-btn"},(0,e.jsx)(Ce,{buttonSize:"lg",portalUrl:o,widgetId:r,onFinish:D,hiddenTabs:S,popperReference:I,nextOrder:h,itemCategoriesInfo:g,hidePopper:w,buttonDescribedby:T,displayedItemTypeCategories:s.displayedItemTypeCategories}))),M.length>0&&(0,e.jsx)("div",{className:"w-100 h-100 p-4"},(0,e.jsx)(_e,{multiDataOptions:M,enableDataAction:l,isLoading:f,widgetId:r,disableRenaming:s.disableRenaming,onRemoveData:t=>{b.current.initialized()&&b.current.deleteAll([t]),y(M.filter((e=>e.dataSourceJson.id!==t))),u(r,e.DataSourcesChangeType.Remove,[c(t)])},onChangeData:t=>{b.current.initialized()&&b.current.put(t.dataSourceJson.id,t),v(!0),function(t){return d(this,void 0,void 0,(function*(){return t&&0!==t.length?Promise.resolve().then((()=>{t.forEach((t=>{const a=c(t.dataSourceJson.id);a&&e.DataSourceManager.getInstance().updateDataSourceByDataSourceJson(a,(0,e.Immutable)(t.dataSourceJson))}))})):Promise.resolve()}))}([t]).catch((e=>{console.error("Failed to update data source",e)})).finally((()=>{v(!1)})),y(M.map((e=>e.dataSourceJson.id===t.dataSourceJson.id?t:e)))}}),(0,e.jsx)("div",{className:"w-100 d-flex justify-content-end add-by-search-samll"},(0,e.jsx)(Ce,{buttonSize:"sm",portalUrl:o,widgetId:r,onFinish:D,hiddenTabs:S,popperReference:I,nextOrder:h,itemCategoriesInfo:g,hidePopper:w,displayedItemTypeCategories:s.displayedItemTypeCategories}))))};st.versionManager=et;const dt=st,ct=e.css`
  background-color: var(--ref-palette-white);
  position: relative;

  .add-by-search-samll {
    position: absolute;
    bottom: 10px;
    right: 15px;
  }

  .no-data-placeholder {
    padding: 8px;
    .no-data-placeholder-text, .no-data-placeholder-icon, .no-data-placeholder-btn{
      display: table;
      margin: 0 auto;
    }
    .no-data-placeholder-text {
      color: var(--ref-palette-neutral-1000);
      font-size: 0.8125rem;
      margin-top: 1rem;
      text-align: center;
    }
    .no-data-placeholder-icon {
      color: var(--ref-palette-neutral-1100);
    }
    .no-data-placeholder-btn {
      margin-top: 1rem;
    }
  }
`;function ut(e){l.p=e}})(),s})())}}}));