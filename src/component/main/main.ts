export interface Activity {
  name: string;
  value: number;
}

export interface DaywiseActivity {
  date: string;
  items: ChildrenObj;
}

export interface ChildrenObj {
  children: PersonData[];
}

export interface PersonData {
  count: number;
  label: string;
  fillColor: string;
}

export interface ActiveDays {
  days: number;
  isBurnOut: boolean;
  insight: string[];
}

export interface RowData {
  name: string;
  totalActivity: Activity[];
  dayWiseActivity: DaywiseActivity[];
  activityDays: ActiveDays[];
}

export interface ActivityMetaData {
  label: string;
  fillColor: string;
}

export type Result = {
  "PR Open": number;
  "PR Merged": number;
  Commits: number;
  "PR Reviewed": number;
  "PR Comments": number;
  "Incident Alerts": number;
  "Incidents Resolved": number;
};
