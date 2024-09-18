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

export const mockActivitiesList = {

  content: [
    {
      activityDefnKey: 'fe48f993-abfa-473c-bdd3-73179a9db117',
      name: 'Activity5',
      description: '',
      application: 'PEM',
      activityVersionLink: 'http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/fe48f993-abfa-473c-bdd3-73179a9db117',
      isDeleted: false,
      // defaultVersion: {
      //   activityDefnVersionKey: '2927159f-5985-4a2e-b873-16cc6d531089',
      //   isEncrypted: false,
      //   version: 1,
      //   status: 'FINAL'
      // }
    }
  ],
  pageContent: {
    number: 0,
    size: 10,
    totalElements: 8,
    totalPages: 1
  }
};

export const mockNewActivityList ={
  "content": [
    {
      "id":"8bea0bbb-8b1b-4598-8e13-e0d407ebd291",
      "activityDefnKey": "8bea0bbb-8b1b-4598-8e13-e0d407ebd291",
      "name": "NewActivity 11",
      "description": "testing",
      "application": "PEM",
      "activityVersionLink": "http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/8bea0bbb-8b1b-4598-8e13-e0d407ebd291",
      "isDeleted": false,
      "defaultVersion": {
        "activityDefnVersionKey": "5806b2aa-2665-42f3-9be3-2c8fdf9212a4",
        "isEncrypted": false,
        "version": 1,
        "status": "DRAFT"
      }
    },
    {
      "activityDefnKey": "f1067288-d7b0-45e8-8e75-5ee2b0f6759a",
      "id": "f1067288-d7b0-45e8-8e75-5ee2b0f6759a",
      "name": "New Activity 15",
      "description": "12",
      "application": "PEM",
      "activityVersionLink": "http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/f1067288-d7b0-45e8-8e75-5ee2b0f6759a",
      "isDeleted": false,
      "defaultVersion": {
        "activityDefnVersionKey": "0cf2e427-1637-4ea7-83bf-f33ecc551ece",
        "isEncrypted": false,
        "version": 1,
        "status": "DRAFT"
      }
    },
    {
      "activityDefnKey": "ad7380b6-cb42-4a2f-a37f-fd9f64fa842c",
      "id": "ad7380b6-cb42-4a2f-a37f-fd9f64fa842c",
      "name": "New Activity 13",
      "description": "12",
      "application": "PEM",
      "activityVersionLink": "http://10.15.106.209:9080/sponsors/cashbank/v2/activityDefinitions/ad7380b6-cb42-4a2f-a37f-fd9f64fa842c",
      "isDeleted": false,
      "defaultVersion": {
        "activityDefnVersionKey": "73e376f3-79f7-4008-a06b-7ae8e3b7c5db",
        "isEncrypted": false,
        "version": 1,
        "status": "DRAFT"
      }
    }
 
  ],
  "pageContent": {
    "number": 0,
    "size": 10,
    "totalElements": 45,
    "totalPages": 5
  }
}
