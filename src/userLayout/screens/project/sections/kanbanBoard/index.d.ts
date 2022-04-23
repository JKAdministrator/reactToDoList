export interface ITask {
  id: string;
  label: string;
}
export interface IColumn {
  id: string;
  label: string;
  tasks: ITask[];
}
