
import { isDefined } from '../../../../../shared-code/lib/lrs/utilities/utils'
import defaultMessages from '../translations/default'
import { round } from 'lodash-es'

  export function validateDateUtil (date: Date, isFromDate: boolean, routeInfo, fromDateToolTip, toDateToolTip, intl){
    const dateInfo = {
      setFromDateStatus: '',
      setToDateStatus: '',
      setFromDateToolTip: '',
      setToDateToolTip: '',
      validDate: true
    }
    const selectedDate = date
    if (!isDefined(selectedDate)) {
      isFromDate ? dateInfo.setFromDateStatus = 'idle' : dateInfo.setToDateStatus = 'idle'
      isFromDate ? dateInfo.setFromDateToolTip = '' : dateInfo.setToDateToolTip = ''
      return dateInfo
    }

    // Check if selected date is before the routes from date.
    if (isDefined(routeInfo?.fromDate)) {
      if (selectedDate < routeInfo?.fromDate) {
        isFromDate ? dateInfo.setFromDateStatus = 'invalid' : dateInfo.setToDateStatus ='invalid'
        isFromDate ? dateInfo.setFromDateToolTip = intl.formatMessage({id: 'invalidFromDateBefore', defaultMessage: defaultMessages.invalidFromDateBefore}) :
            dateInfo.setToDateToolTip = intl.formatMessage({id:'invalidToDateBefore', defaultMessage: defaultMessages.invalidToDateBefore})
        dateInfo.validDate = false
        return dateInfo
      }
    }

    // Check if the selected date is before the to routes from date
    // Verify that the selected date is not before the to route from date.
    if (isDefined(routeInfo?.toRouteFromDate)) {
      if (selectedDate < routeInfo?.toRouteFromDate) {
        isFromDate ? dateInfo.setFromDateStatus ='invalid' : dateInfo.setToDateStatus ='invalid'
        isFromDate ? dateInfo.setFromDateToolTip = intl.formatMessage({id:'invalidFromDateBefore', defaultMessage: defaultMessages.invalidFromDateBefore}) :
        dateInfo.setToDateToolTip = intl.formatMessage({id:'invalidToDateBefore', defaultMessage: defaultMessages.invalidToDateBefore})
        dateInfo.validDate = false
        return dateInfo
      }
    }

    // Check if the selected date is after the routes to date.
    if (isDefined(routeInfo?.toDate)) {
      if (selectedDate > routeInfo?.toDate) {
        isFromDate ? dateInfo.setFromDateStatus = 'invalid' : dateInfo.setToDateStatus = 'invalid'
        isFromDate ? dateInfo.setFromDateToolTip = intl.formatMessage({id: 'invalidFromDateAfter', defaultMessage: defaultMessages.invalidFromDateAfter}) :
        dateInfo.setToDateToolTip = intl.formatMessage({id: 'invalidToDateAfter', defaultMessage: defaultMessages.invalidToDateAfter})
        dateInfo.validDate = false
        return dateInfo
      }
    }

    // Check if the selected date is after the to routes to date.
    // Verify that the selected date is not after the to route to date.
    if (isDefined(routeInfo?.toRouteToDate)) {
      if (selectedDate > routeInfo?.toRouteToDate) {
        isFromDate ? dateInfo.setFromDateStatus = 'invalid' : dateInfo.setToDateStatus = 'invalid'
        isFromDate ? dateInfo.setFromDateToolTip = intl.formatMessage({id: 'invalidFromDateAfter', defaultMessage: defaultMessages.invalidFromDateAfter}) :
        dateInfo.setToDateToolTip = intl.formatMessage({id: 'invalidToDateAfter', defaultMessage: defaultMessages.invalidToDateAfter})
        dateInfo.validDate = false
        return dateInfo
      }
    }

    // From date is greater than to date
    if (isDefined(routeInfo?.selectedToDate)) {
      if (isFromDate) {
        if (selectedDate > routeInfo?.selectedToDate) {
          dateInfo.setFromDateStatus = 'invalid'
          isFromDate ? dateInfo.setFromDateToolTip = intl.formatMessage({id: 'invalidDatesOrder', defaultMessage: defaultMessages.invalidDatesOrder}) :
          dateInfo.setToDateToolTip = intl.formatMessage({id: 'invalidDatesOrder', defaultMessage: defaultMessages.invalidDatesOrder})
          dateInfo.validDate = false
        }
        // see if we need to clear toDate error
        if (toDateToolTip === intl.formatMessage({id: 'invalidDatesOrder', defaultMessage: defaultMessages.invalidDatesOrder})) {
          if (selectedDate < routeInfo?.selectedToDate) {
            dateInfo.setToDateStatus = 'idle'
            dateInfo.setToDateToolTip = ''
          }
        // see if this fixes to date error where dates were same
        } else if (toDateToolTip === intl.formatMessage({id: 'invalidDatesSameDay', defaultMessage: defaultMessages.invalidDatesSameDay})) {
          if (selectedDate !== routeInfo?.selectedFromDate) {
            dateInfo.setToDateStatus = 'idle'
            dateInfo.setToDateToolTip = ''
          }
        }
      }
    }

    // From date and to date are equal
    if (isDefined(routeInfo?.selectedToDate)) {
      if (isFromDate && selectedDate.getTime() === routeInfo?.selectedToDate.getTime()) {
        dateInfo.setFromDateStatus = 'invalid'
        isFromDate ? dateInfo.setFromDateToolTip = intl.formatMessage({id: 'invalidDatesSameDay', defaultMessage: defaultMessages.invalidDatesSameDay}) :
        dateInfo.setToDateToolTip = intl.formatMessage({id: 'invalidDatesSameDay', defaultMessage: defaultMessages.invalidDatesSameDay})
        dateInfo.validDate = false
      }
    }

    // To date is less than from date
    if (isDefined(routeInfo?.selectedFromDate)) {
      if (!isFromDate) {
        if (selectedDate < routeInfo?.selectedFromDate) {
          dateInfo.setToDateStatus = 'invalid'
          isFromDate ? dateInfo.setFromDateToolTip = intl.formatMessage({id: 'invalidDatesOrder', defaultMessage: defaultMessages.invalidDatesOrder}) :
          dateInfo.setToDateToolTip = intl.formatMessage({id: 'invalidDatesOrder', defaultMessage: defaultMessages.invalidDatesOrder})
          dateInfo.validDate = false
        }
        // see if we need to clear from date error
        if (fromDateToolTip === intl.formatMessage({id: 'invalidDatesOrder', defaultMessage: defaultMessages.invalidDatesOrder})) {
          if (selectedDate > routeInfo?.selectedFromDate) {
            dateInfo.setFromDateStatus = 'idle'
            dateInfo.setFromDateToolTip = ''
          }
        // see if we need to clear from date equals error
        } else if (fromDateToolTip === intl.formatMessage({id: 'invalidDatesSameDay', defaultMessage: defaultMessages.invalidDatesSameDay})) {
          if (selectedDate !== routeInfo?.selectedFromDate) {
            dateInfo.setFromDateStatus = 'idle'
            dateInfo.setFromDateToolTip = ''
          }
        }
      }
    }

    // To date and from date are equal
    if (isDefined(routeInfo?.selectedFromDate)) {
      if (!isFromDate && selectedDate.getTime() === routeInfo?.selectedFromDate.getTime()) {
        dateInfo.setToDateStatus = 'invalid'
        isFromDate ? dateInfo.setFromDateToolTip = intl.formatMessage({id: 'invalidDatesSameDay', defaultMessage: defaultMessages.invalidDatesSameDay}) :
        dateInfo.setToDateToolTip = intl.formatMessage({id: 'invalidDatesSameDay', defaultMessage: defaultMessages.invalidDatesSameDay})
        dateInfo.validDate = false
      }
    }

    if (dateInfo.validDate) {
      isFromDate ? dateInfo.setFromDateStatus = 'idle' : dateInfo.setToDateStatus = 'idle'
      isFromDate ? dateInfo.setFromDateToolTip = '' : dateInfo.setToDateToolTip =''
    }

    return dateInfo
  }

  export function isValidRouteSelectionUtilMulti(routeInfo, eventInfo, selectedNetwork) {

    if (!isDefined(routeInfo)) {
      return false
    }

    let isValid = true
    isValid = isValid && routeInfo.routeId?.length > 0
    isValid = isValid && routeInfo.toRouteId?.length > 0

    if (!isDefined(selectedNetwork) || !isDefined(selectedNetwork.networkInfo)) {
      return false
    }
    const fromMeasure = round(routeInfo.fromMeasure, selectedNetwork.networkInfo.measurePrecision)
    const toMeasure = round(routeInfo.toMeasure, selectedNetwork.networkInfo.measurePrecision)
    const selectedFromMeasure = round(routeInfo.selectedMeasure, selectedNetwork.networkInfo.measurePrecision)
    const selectedToMeasure = round(routeInfo.selectedToMeasure, selectedNetwork.networkInfo.measurePrecision)

    if (!isNaN(fromMeasure) && !isNaN(selectedFromMeasure)) {
      isValid = isValid && selectedFromMeasure >= fromMeasure
    } else {
      // No route selected or no measure on selected route.
      return false
    }

    if (!eventInfo?.canSpanRoutes) {
      if (!isNaN(toMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure <= toMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
    } else {
      const toRouteFromMeasure = round(routeInfo.toRouteFromMeasure, selectedNetwork.networkInfo.measurePrecision)
      const toRouteToMeasure = round(routeInfo.toRouteToMeasure, selectedNetwork.networkInfo.measurePrecision)
      if (!isNaN(toRouteFromMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure >= toRouteFromMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
      if (!isNaN(toRouteToMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure <= toRouteToMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
    }

    if (
      isDefined(routeInfo.selectedFromDate) &&
      !isDefined(routeInfo.selectedToDate)
    ) {
      // Only from date provided.
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedFromDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedFromDate < routeInfo.toDate
      }
    }
    if (
      !isDefined(routeInfo.selectedFromDate) &&
      isDefined(routeInfo.selectedToDate)
    ) {
      // Only to date provided.
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedToDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedToDate < routeInfo.toDate
      }
    }
    if (
      isDefined(routeInfo.selectedFromDate) &&
      isDefined(routeInfo.selectedToDate)
    ) {
      // Both from and to date provided.
      isValid = isValid && routeInfo.selectedFromDate < routeInfo.selectedToDate
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedFromDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedToDate <= routeInfo.toDate
      }
    }
    if (
      !isDefined(routeInfo.selectedFromDate) &&
      !isDefined(routeInfo.selectedToDate)
    ) {
      // No date selected.
      return false
    }

    return isValid
  }

  export function isValidRouteSelectionUtil(routeInfo, selectedEvent, lockAquired, selectedNetwork) {

    if (!isDefined(routeInfo)) {
      return false
    }

    let isValid = true
    isValid = isValid && routeInfo.routeId?.length > 0
    isValid = isValid && routeInfo.toRouteId?.length > 0

    if (!lockAquired) {
      return false
    }

    if (!isDefined(selectedNetwork) || !isDefined(selectedNetwork.networkInfo)) {
      return false
    }
    const fromMeasure = round(routeInfo.fromMeasure, selectedNetwork.networkInfo.measurePrecision)
    const toMeasure = round(routeInfo.toMeasure, selectedNetwork.networkInfo.measurePrecision)
    const selectedFromMeasure = round(routeInfo.selectedMeasure, selectedNetwork.networkInfo.measurePrecision)
    const selectedToMeasure = round(routeInfo.selectedToMeasure, selectedNetwork.networkInfo.measurePrecision)

    if (!isNaN(fromMeasure) && !isNaN(selectedFromMeasure)) {
      isValid = isValid && selectedFromMeasure >= fromMeasure
    } else {
      // No route selected or no measure on selected route.
      return false
    }

    if (!selectedEvent.eventInfo?.canSpanRoutes) {
      if (!isNaN(toMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure <= toMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
    } else {
      const toRouteFromMeasure = round(routeInfo.toRouteFromMeasure, selectedNetwork.networkInfo.measurePrecision)
      const toRouteToMeasure = round(routeInfo.toRouteToMeasure, selectedNetwork.networkInfo.measurePrecision)
      if (!isNaN(toRouteFromMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure >= toRouteFromMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
      if (!isNaN(toRouteToMeasure) && !isNaN(selectedToMeasure)) {
        isValid = isValid && selectedToMeasure <= toRouteToMeasure
      } else {
        // No route selected or no measure on selected route.
        return false
      }
    }

    // dates
    if (
      isDefined(routeInfo.selectedFromDate) &&
      !isDefined(routeInfo.selectedToDate)
    ) {
      // Only from date provided.
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedFromDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedFromDate < routeInfo.toDate
      }
    }
    if (
      !isDefined(routeInfo.selectedFromDate) &&
      isDefined(routeInfo.selectedToDate)
    ) {
      // Only to date provided.
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedToDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedToDate < routeInfo.toDate
      }
    }
    if (
      isDefined(routeInfo.selectedFromDate) &&
      isDefined(routeInfo.selectedToDate)
    ) {
      // Both from and to date provided.
      isValid = isValid && routeInfo.selectedFromDate < routeInfo.selectedToDate
      if (isDefined(routeInfo.fromDate)) {
        isValid = isValid && routeInfo.selectedFromDate >= routeInfo.fromDate
      }
      if (isDefined(routeInfo.toDate)) {
        isValid = isValid && routeInfo.selectedToDate <= routeInfo.toDate
      }
    }
    if (
      !isDefined(routeInfo.selectedFromDate) &&
      !isDefined(routeInfo.selectedToDate)
    ) {
      // No date selected.
      return false
    }
    // verify that both routes are within the selected date range
    if (routeInfo.routeId !== routeInfo.toRouteId) {
      if (isDefined(routeInfo.fromDate) && isDefined(routeInfo.toRouteFromDate)) {
        if (routeInfo.selectedFromDate < routeInfo.fromDate || (isDefined(routeInfo.toDate) && routeInfo.selectedFromDate > routeInfo.toDate) ||
          routeInfo.selectedFromDate < routeInfo.toRouteFromDate || (isDefined(routeInfo.toRouteToDate) && routeInfo.selectedFromDate > routeInfo.toRouteToDate)) {
          return false
        }
      }
    }

    return isValid
  }