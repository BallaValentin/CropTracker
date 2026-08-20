export interface ConfirmUpdateDTO {
    confirmationRequired: boolean;
    numberOfOngoing: number;
    numberOfScheduled: number;
}