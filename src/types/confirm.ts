export interface ConfirmPayload {
  msg: string;
  confirmMsg: string;
  cancelMsg: string;
  cb: (() => void) | null;
}
