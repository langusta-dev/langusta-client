export interface ConfirmPayload {
  msg: string;
  confirmMsg: string;
  cancelMsg: string | null;
  cb: (() => void) | null;
}
