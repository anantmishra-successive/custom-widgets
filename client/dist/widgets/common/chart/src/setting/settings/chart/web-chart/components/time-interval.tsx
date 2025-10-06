import { React } from 'jimu-core'
import { WebChartTemporalBinningUnits } from 'jimu-ui/advanced/chart'
import { DateUnitInput, type DateUnitInputValue, UnitSelectorDateWeekUnits, UnitSelectorTimeUnits, type DateTimeUnits } from 'jimu-ui/advanced/style-setting-components'

interface TimeIntervalProps {
  className?: string
  'aria-label'?: string
  size: number
  unit: WebChartTemporalBinningUnits
  onChange: (size: number, unit: WebChartTemporalBinningUnits) => void
}

export const DateTimeUnitsMap = {
  [UnitSelectorDateWeekUnits[0]]: WebChartTemporalBinningUnits.Year,
  [UnitSelectorDateWeekUnits[1]]: WebChartTemporalBinningUnits.Month,
  [UnitSelectorDateWeekUnits[2]]: WebChartTemporalBinningUnits.Week,
  [UnitSelectorDateWeekUnits[3]]: WebChartTemporalBinningUnits.Day,
  [UnitSelectorTimeUnits[0]]: WebChartTemporalBinningUnits.Hour,
  [UnitSelectorTimeUnits[1]]: WebChartTemporalBinningUnits.Minute,
  [UnitSelectorTimeUnits[2]]: WebChartTemporalBinningUnits.Second,
  [WebChartTemporalBinningUnits.Second]: UnitSelectorTimeUnits[2],
  [WebChartTemporalBinningUnits.Minute]: UnitSelectorTimeUnits[1],
  [WebChartTemporalBinningUnits.Hour]: UnitSelectorTimeUnits[0],
  [WebChartTemporalBinningUnits.Day]: UnitSelectorDateWeekUnits[3],
  [WebChartTemporalBinningUnits.Week]: UnitSelectorDateWeekUnits[2],
  [WebChartTemporalBinningUnits.Month]: UnitSelectorDateWeekUnits[1],
  [WebChartTemporalBinningUnits.Year]: UnitSelectorDateWeekUnits[0]
}

const Units = [...UnitSelectorDateWeekUnits, ...UnitSelectorTimeUnits]

export const TimeInterval = (props: TimeIntervalProps): React.ReactElement => {
  const { className, 'aria-label': ariaLabel, size, unit, onChange } = props

  const value: DateUnitInputValue = React.useMemo(() => {
    return {
      val: size,
      unit: DateTimeUnitsMap[unit] as DateTimeUnits
    }
  }, [size, unit])

  const handleChange = (value: DateUnitInputValue) => {
    const size = value.val
    const unit = DateTimeUnitsMap[value.unit] as WebChartTemporalBinningUnits
    onChange(size, unit)
  }

  return (
    <DateUnitInput aria-label={ariaLabel} min={1} max={1000} className={className} units={Units} value={value} onChange={handleChange} />
  )
}
