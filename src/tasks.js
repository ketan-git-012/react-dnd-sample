import { COLUMN_NAMES } from "./constants";

const {DO_IT, IN_PROGRESS, AWAITING_REVIEW} = COLUMN_NAMES;
export const tasks = [
    {id: 1, name: 'Task 1', ticket_id: 'TC-2766', column: DO_IT, profile: 'assets/abc.png'},
    {id: 2, name: 'Task 2', ticket_id: 'TC-2767', column: DO_IT, profile: 'assets/i.jpeg'},
    {id: 3, name: 'Task 3', ticket_id: 'TC-2768', column: DO_IT, profile: 'assets/abc.png'},
    {id: 4, name: 'Task 4', ticket_id: 'TC-2769', column: DO_IT, profile: 'assets/abc.png'},
    {id: 5, name: 'Task 5', ticket_id: 'TC-2770', column: IN_PROGRESS, profile: 'assets/i.jpeg'},
    {id: 6, name: 'work on drag and drop', ticket_id: 'TC-2771', column: AWAITING_REVIEW,  profile: 'assets/abc.png'},
];
