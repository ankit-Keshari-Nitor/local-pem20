export const mockViewPartnersData = {
  participants: 60,
  onSchedule: 40,
  delayed: 15,
  completed: 13,
  sponsorAction: 15,
  _embedded: {
    data: [
      {
        id: 1,
        partnerName: 'Partner-1',
        description: 'Testing',
        currentTask: 'unnamed',
        completed: '0',
        skipped: '0',
        dueDate: '20/06/2024',
        delay: '00',
        status: 'In-Progress',
        lastUpdated: '20/06/2024'
      },
      {
        id: 2,
        partnerName: 'Partner-2',
        currentTask: 'unnamed',
        completed: '0',
        description: 'Testing',
        skipped: '0',
        dueDate: '20/06/2024',
        delay: '00',
        status: 'Not-Started',
        lastUpdated: '20/06/2024'
      },
      {
        id: 3,
        partnerName: 'Partner-3',
        currentTask: 'unnamed',
        completed: '0',
        description: 'Testing',
        skipped: '0',
        dueDate: '20/06/2024',
        delay: '00',
        status: 'Sponsor Admin',
        lastUpdated: '20/06/2024'
      }
    ]
  },
  page: {
    totalItems: 3,
    end: 2,
    start: 0,
    pageSize: 1,
    pageNumber: 1
  }
};

export const mockPartnerTaskData = {
  _embedded: {
    data: [
      {
        id: 1,
        task: 'Task-1',
        owner: 'Owner-1',
        email: 'email-1',
        status: 'In-Progress',
        lastUpdated: '20/06/2024, 08:20:45 PM'
      },
      {
        id: 2,
        owner: 'Owner-2',
        task: 'Task-2',
        status: 'Not-Started',
        email: 'email-2',
        lastUpdated: '20/06/2024, 08:20:45 PM'
      },
      {
        id: 3,
        task: 'Task-3',
        owner: 'Owner-3',
        status: 'Completed',
        email: 'email-3',
        lastUpdated: '20/06/2024, 08:20:45 PM'
      }
    ]
  },
  page: {
    totalItems: 3,
    end: 2,
    start: 0,
    pageSize: 1,
    pageNumber: 1
  }
};

export const mockRolloutData = {
  notStartActivities: 60,
  inProgressActivities: 40,
  completedActivities: 15,
  closedActivities: 13,
  _embedded: {
    data: [
      {
        id: 1,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '10',
        definitionName: 'Def Task feb 23A',
        status: 'In-Progress',
        dueDate: '20/06/2024',
        delay: '00'
      },
      {
        id: 2,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '7',
        definitionName: 'Def Task feb 23A',
        status: 'Not-Started',
        dueDate: '21/06/2024',
        delay: '01'
      },
      {
        id: 3,
        name: 'Activity feb 23A',
        description: '',
        partners: '13',
        definitionName: 'Def Task feb 23A',
        status: 'Completed',
        dueDate: '22/06/2024',
        delay: '10'
      },
      {
        id: 4,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '4',
        definitionName: 'Def Task feb 23A',
        status: 'Closed',
        dueDate: '10/06/2024',
        delay: '03'
      },
      {
        id: 5,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '5',
        definitionName: 'Def Task feb 23A',
        status: 'Closed',
        dueDate: '27/06/2024',
        delay: '08'
      },
      {
        id: 6,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '12',
        definitionName: 'Test definitionName6',
        status: 'Closed',
        dueDate: '28/06/2024',
        delay: '09'
      }
    ]
  },
  page: {
    totalItems: 3,
    end: 2,
    start: 0,
    pageSize: 1,
    pageNumber: 1
  }
};

export const mockPartnerData = {
  notStartActivities: 60,
  inProgressActivities: 40,
  completedActivities: 15,
  closedActivities: 13,
  sponsorAction: 12,
  _embedded: {
    data: [
      {
        id: 1,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '10',
        definitionName: 'Def Task feb 23A',
        status: 'In-Progress',
        dueDate: '20/06/2024',
        delay: '00'
      },
      {
        id: 2,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '7',
        definitionName: 'Def Task feb 23A',
        status: 'Not-Started',
        dueDate: '21/06/2024',
        delay: '01'
      },
      {
        id: 3,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '13',
        definitionName: 'Def Task feb 23A',
        status: 'Completed',
        dueDate: '22/06/2024',
        delay: '10'
      },
      {
        id: 4,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '4',
        definitionName: 'Def Task feb 23A',
        status: 'Closed',
        dueDate: '10/06/2024',
        delay: '03'
      },
      {
        id: 5,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '5',
        definitionName: 'Def Task feb 23A',
        status: 'Closed',
        dueDate: '27/06/2024',
        delay: '08'
      },
      {
        id: 6,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '12',
        definitionName: 'Test definitionName6',
        status: 'Closed',
        dueDate: '28/06/2024',
        delay: '09'
      }
    ]
  },
  page: {
    totalItems: 3,
    end: 2,
    start: 0,
    pageSize: 1,
    pageNumber: 1
  }
};

export const mockInternalData = {
  notStartActivities: 60,
  inProgressActivities: 40,
  completedActivities: 15,
  closedActivities: 13,
  onScheduleActivities: 12,
  _embedded: {
    data: [
      {
        id: 1,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '10',
        definitionName: 'Def Task feb 23A',
        status: 'In-Progress',
        dueDate: '20/06/2024',
        delay: '00'
      },
      {
        id: 2,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '7',
        definitionName: 'Def Task feb 23A',
        status: 'Not-Started',
        dueDate: '21/06/2024',
        delay: '01'
      },
      {
        id: 3,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '13',
        definitionName: 'Def Task feb 23A',
        status: 'Completed',
        dueDate: '22/06/2024',
        delay: '10'
      },
      {
        id: 4,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '4',
        definitionName: 'Def Task feb 23A',
        status: 'Closed',
        dueDate: '10/06/2024',
        delay: '03'
      },
      {
        id: 5,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '5',
        definitionName: 'Def Task feb 23A',
        status: 'Closed',
        dueDate: '27/06/2024',
        delay: '08'
      },
      {
        id: 6,
        name: 'Activity feb 23A',
        description: 'Testing',
        partners: '12',
        definitionName: 'Test definitionName6',
        status: 'Closed',
        dueDate: '28/06/2024',
        delay: '09'
      }
    ]
  },
  page: {
    totalItems: 3,
    end: 2,
    start: 0,
    pageSize: 1,
    pageNumber: 1
  }
};

export const mockActivities = {
  rolledOutActivities: 100,
  partnersActivities: 50,
  internalActivities: 10
};
