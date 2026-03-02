import {
  PacingPeriod,
  ScheduleItem,
} from '../../../services/fetch-pacing-schedule';

// ============= UTILITY FUNCTIONS =============
export const calculateTotalLeads = (data: PacingPeriod[]): number => {
  return data.reduce((sum, period) => sum + period.LeadsCount, 0);
};

export const redistributeLeads = (
  data: PacingPeriod[],
  targetLeadGoal: number,
  preserveZeros: boolean = true,
): PacingPeriod[] => {
  if (data.length === 0 || targetLeadGoal === 0) {
    return data;
  }

  // Deep clone to avoid mutations
  const newData = JSON.parse(JSON.stringify(data));

  // If preserving zeros, only redistribute among non-zero entries
  if (preserveZeros) {
    // Count periods that have non-zero leads or can receive leads
    const eligiblePeriods = newData.filter((period: PacingPeriod) => {
      // Check if period has any non-zero schedules or the period itself is non-zero
      if (period.schedules && period.schedules.length > 0) {
        return period.schedules.some((s: ScheduleItem) => s.LeadsCount > 0);
      }
      return period.LeadsCount > 0;
    });

    if (eligiblePeriods.length === 0) {
      // If all are zero, distribute evenly to all
      return redistributeLeads(data, targetLeadGoal, false);
    }

    // Calculate distribution only among eligible periods
    const perPeriod = Math.floor(targetLeadGoal / eligiblePeriods.length);
    const remainder = targetLeadGoal % eligiblePeriods.length;
    let remainderAssigned = 0;

    newData.forEach((period: any) => {
      // Check if this period is eligible for redistribution
      const isEligible =
        period.schedules && period.schedules.length > 0
          ? period.schedules.some((s: any) => s.LeadsCount > 0)
          : period.LeadsCount > 0;

      if (isEligible) {
        // Set the period's lead count
        period.LeadsCount = perPeriod + (remainderAssigned < remainder ? 1 : 0);
        if (remainderAssigned < remainder) remainderAssigned++;

        // Redistribute within schedules, preserving zeros
        if (period.schedules && period.schedules.length > 0) {
          const eligibleSchedules = period.schedules.filter(
            (s: any) => s.LeadsCount > 0,
          );

          if (eligibleSchedules.length > 0) {
            const perSchedule = Math.floor(
              period.LeadsCount / eligibleSchedules.length,
            );
            const scheduleRemainder =
              period.LeadsCount % eligibleSchedules.length;
            let scheduleRemainderAssigned = 0;

            period.schedules.forEach((schedule: any) => {
              if (schedule.LeadsCount > 0) {
                schedule.LeadsCount =
                  perSchedule +
                  (scheduleRemainderAssigned < scheduleRemainder ? 1 : 0);
                if (scheduleRemainderAssigned < scheduleRemainder)
                  scheduleRemainderAssigned++;
              }
              // Keep zero values as zero
            });
          } else {
            // If all child schedules are zero, distribute evenly among all
            const perSchedule = Math.floor(
              period.LeadsCount / period.schedules.length,
            );
            const scheduleRemainder =
              period.LeadsCount % period.schedules.length;
            period.schedules.forEach((schedule: any, idx: number) => {
              schedule.LeadsCount =
                perSchedule + (idx === 0 ? scheduleRemainder : 0);
            });
          }
        }
      } else {
        // Keep this period at zero
        period.LeadsCount = 0;
        if (period.schedules) {
          period.schedules.forEach((schedule: any) => {
            schedule.LeadsCount = 0;
          });
        }
      }
    });
  } else {
    // Original logic - distribute evenly to all
    const perPeriod = Math.floor(targetLeadGoal / newData.length);
    const remainder = targetLeadGoal % newData.length;

    newData.forEach((period: any, index: number) => {
      period.LeadsCount = perPeriod + (index === 0 ? remainder : 0);

      if (period.schedules && period.schedules.length > 0) {
        const perSchedule = Math.floor(
          period.LeadsCount / period.schedules.length,
        );
        const scheduleRemainder = period.LeadsCount % period.schedules.length;
        period.schedules.forEach((schedule: any, idx: number) => {
          schedule.LeadsCount =
            perSchedule + (idx === 0 ? scheduleRemainder : 0);
        });
      }
    });
  }

  return newData;
};

export const redistributeWithinPeriod = (
  period: PacingPeriod,
  targetTotal: number,
  preserveZeros: boolean = true,
): PacingPeriod => {
  // Deep clone to avoid mutations
  const newPeriod = JSON.parse(JSON.stringify(period));

  if (!newPeriod.schedules || newPeriod.schedules.length === 0) {
    newPeriod.LeadsCount = targetTotal;
    return newPeriod;
  }

  newPeriod.LeadsCount = targetTotal;

  if (preserveZeros) {
    // Only redistribute among non-zero schedules
    const eligibleSchedules = newPeriod.schedules.filter(
      (s: ScheduleItem) => s.LeadsCount > 0,
    );

    if (eligibleSchedules.length === 0) {
      // If all are zero, distribute evenly to all
      const perSchedule = Math.floor(targetTotal / newPeriod.schedules.length);
      const remainder = targetTotal % newPeriod.schedules.length;

      newPeriod.schedules.forEach((schedule: ScheduleItem, idx: number) => {
        schedule.LeadsCount = perSchedule + (idx === 0 ? remainder : 0);
      });
    } else {
      // Distribute only among eligible schedules
      const perSchedule = Math.floor(targetTotal / eligibleSchedules.length);
      const remainder = targetTotal % eligibleSchedules.length;
      let remainderAssigned = 0;

      newPeriod.schedules.forEach((schedule: ScheduleItem) => {
        if (schedule.LeadsCount > 0) {
          schedule.LeadsCount =
            perSchedule + (remainderAssigned < remainder ? 1 : 0);
          if (remainderAssigned < remainder) remainderAssigned++;
        }
        // Keep zero values as zero
      });
    }
  } else {
    // Distribute evenly to all schedules
    const perSchedule = Math.floor(targetTotal / newPeriod.schedules.length);
    const remainder = targetTotal % newPeriod.schedules.length;

    newPeriod.schedules.forEach((schedule: ScheduleItem, idx: number) => {
      schedule.LeadsCount = perSchedule + (idx === 0 ? remainder : 0);
    });
  }

  return newPeriod;
};

export const getDailySchedules = (
  data: PacingPeriod[],
  hideZeroLeadCount: boolean,
): any[] => {
  const allSchedules: any[] = [];
  data.forEach((period) => {
    period.schedules.forEach((schedule) => {
      if (!hideZeroLeadCount || schedule.LeadsCount > 0) {
        allSchedules.push({
          ...schedule,
          parentId: period.id,
          period: period.period,
        });
      }
    });
  });
  return allSchedules;
};

export const getFilteredPeriods = (
  data: PacingPeriod[],
  hideZeroLeadCount: boolean,
): PacingPeriod[] => {
  if (!hideZeroLeadCount) {
    return data;
  }

  // Filter periods that have non-zero lead count or have any child schedules with non-zero count
  return data.filter((period) => {
    if (period.LeadsCount > 0) {
      return true;
    }

    // Check if any child schedule has non-zero leads
    if (period.schedules && period.schedules.length > 0) {
      return period.schedules.some((schedule) => schedule.LeadsCount > 0);
    }

    return false;
  });
};

export const redistributeDeficit = (
  data: PacingPeriod[],
  currentPeriodIndex: number,
  deficit: number,
  deficitManagement: boolean,
): PacingPeriod[] => {
  if (!deficitManagement || deficit === 0 || data.length === 0) {
    return data;
  }

  // Deep clone to avoid mutations
  const newData = JSON.parse(JSON.stringify(data));

  // Find remaining periods after the current period
  const remainingPeriods = newData.slice(currentPeriodIndex + 1);

  if (remainingPeriods.length === 0) {
    // No periods left to redistribute to
    return newData;
  }

  // Calculate deficit distribution
  const deficitPerPeriod = Math.floor(deficit / remainingPeriods.length);
  const deficitRemainder = deficit % remainingPeriods.length;

  // Redistribute the deficit across remaining periods
  remainingPeriods.forEach((period: PacingPeriod, index: number) => {
    const additionalLeads =
      deficitPerPeriod + (index === 0 ? deficitRemainder : 0);
    period.LeadsCount += additionalLeads;

    // Also redistribute within schedules if they exist
    if (period.schedules && period.schedules.length > 0) {
      const perSchedule = Math.floor(additionalLeads / period.schedules.length);
      const scheduleRemainder = additionalLeads % period.schedules.length;

      period.schedules.forEach((schedule: ScheduleItem, idx: number) => {
        schedule.LeadsCount +=
          perSchedule + (idx === 0 ? scheduleRemainder : 0);
      });
    }
  });

  // Update the original data array with redistributed values
  for (let i = currentPeriodIndex + 1; i < newData.length; i++) {
    newData[i] = remainingPeriods[i - currentPeriodIndex - 1];
  }

  return newData;
};
