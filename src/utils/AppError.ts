/**
 * A custom error class that indicates an app-related error.
 */

interface AppErrorProps {
  message: string;
  display?: boolean;
  data?: any;
  code?: string;
}
class AppError extends Error {
  /**
   * Constructor for the app error
   *
   */
  display: boolean;
  data: any;
  code?: string;
  constructor({ message, display, data, code }: AppErrorProps) {
    super();
    this.message = message;
    this.display = display ? display : false;
    this.data = data ? data : {};

    if (code) this.code = code;
  }
}

export default AppError;
