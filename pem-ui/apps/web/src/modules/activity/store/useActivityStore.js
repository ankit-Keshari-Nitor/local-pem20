import { create } from 'zustand';

const Activity_Initial_State = {
  definition: {
    name: 'New Activity',
    description: '',
    definationKey: ''
  },
  version: {
    key: '',
    encrypted: false,
    contextData: '',
    status: 'Draft',
    number: 1
  },
  schema: {
    nodes: [],
    edges: []
  }
};

const Selected_Activity_Initial_State = {
  actDefName: '',
  activityDefKey: '',
  actDefVerKey: '',
  actDefStatus: 'Draft',
  operation: 'New',
  status: 'Draft',
  version: 1
};

const activityStore = (set, get) => ({
  selectedActivity: Selected_Activity_Initial_State,
  activityData: Activity_Initial_State,
  // Activity Flow State
  updateActivityDetails: (activity) => {
    set((state) => {
      return {
        activityData: {
          definition: activity.definition,
          version: activity.version,
          schema: activity.schema
        },
        selectedActivity: state.selectedActivity
      };
    });
  },
  updateActivityData: (activityData) => {
    set((state) => {
      return {
        activityData: activityData,
        selectedActivity: state?.selectedActivity
      };
    });

  }  ,
  //this changes during -
  updateActivitySchema: (task) => {
    set((state) => {
      return {
        activityData: {
          definition: state?.activityData?.definition,
          version: state?.activityData?.version,
          schema: { ...task }
        },
        selectedActivity: state?.selectedActivity
      };
    });
  },
  setSelectedActivity: (currentActivity) => {
    set((state) => {
      //const selectedActivity = { actDefName, activityDefKey, actDefVerKey, operation,status,version:`Ver.${version}` };
      return { ...state.activityData, selectedActivity: currentActivity };
    });
  },
  reset: () => {
    set({
      activityData: Activity_Initial_State,
      selectedActivity: Selected_Activity_Initial_State
    });
  }
});

const useActivityStore = create(activityStore);

export default useActivityStore;
