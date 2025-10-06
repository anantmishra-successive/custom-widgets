"use client";
import React from "react";
import { FormattedMessage, Immutable, type ImmutableArray } from "jimu-core";
import { BaseWidgetSetting, type AllWidgetSettingProps } from "jimu-for-builder";
import { MapWidgetSelector } from "jimu-ui/advanced/setting-components";
import { TextInput, Label, Switch, NumericInput } from "jimu-ui";

interface Config {
  configText?: string;
  enableOffline?: boolean;
  offlineBuffer?: number;
}

interface State {
  configText: string;
  enableOffline: boolean;
  offlineBuffer: number;
}

interface CustomWidgetSettingProps extends AllWidgetSettingProps<Config> {}

export default class Setting extends BaseWidgetSetting<CustomWidgetSettingProps, State> {
  constructor(props: CustomWidgetSettingProps) {
    super(props);
    this.state = {
      configText: props.config?.configText || "",
      enableOffline: props.config?.enableOffline || false,
      offlineBuffer: props.config?.offlineBuffer || 1000, // Default 1km buffer
    };
  }

  onMapWidgetSelected = (useMapWidgetIds: ImmutableArray<string>) => {
    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds,
    });
  };

  onConfigTextChange = (evt: React.FormEvent<HTMLInputElement>) => {
    this.setState({ configText: evt.currentTarget.value }, this.onSettingChange);
  };

  onEnableOfflineChange = (evt: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ enableOffline: checked }, this.onSettingChange);
  };

  onOfflineBufferChange = (value: number) => {
    this.setState({ offlineBuffer: value || 0 }, this.onSettingChange);
  };

  onSettingChange = () => {
    const { configText, enableOffline, offlineBuffer } = this.state;
    this.props.onSettingChange({
      id: this.props.id,
      config: Immutable({
        ...this.props.config,
        configText,
        enableOffline,
        offlineBuffer
      })
    });
  };

  render() {
    const { configText, enableOffline, offlineBuffer } = this.state;

    return (
      <div className="widget-setting-offline-map-area">
        <div className="mb-3">
          <Label>
            <FormattedMessage id="selectMapWidget" defaultMessage="Select Map Widget" />
          </Label>
          <MapWidgetSelector
            useMapWidgetIds={this.props.useMapWidgetIds}
            onSelect={this.onMapWidgetSelected}
          />
        </div>
        
        <div className="mb-3">
          <Label>
            <FormattedMessage id="configText" defaultMessage="Configuration Text:" />
          </Label>
          <TextInput
            value={configText}
            onChange={this.onConfigTextChange}
            placeholder="Enter configuration text (e.g., layer IDs)"
          />
        </div>
        
        <div className="mb-3">
          <Label>
            <FormattedMessage id="enableOffline" defaultMessage="Enable Offline Mode" />
          </Label>
          <Switch
            checked={enableOffline}
            onChange={this.onEnableOfflineChange}
          />
        </div>
        
        {enableOffline && (
          <div className="mb-3">
            <Label>
              <FormattedMessage id="offlineBuffer" defaultMessage="Offline Area Buffer (meters):" />
            </Label>
            <NumericInput
              value={offlineBuffer}
              onChange={this.onOfflineBufferChange}
              min={0}
              step={100}
              style={{ width: "100px" }}
            />
          </div>
        )}
      </div>
    );
  }
}