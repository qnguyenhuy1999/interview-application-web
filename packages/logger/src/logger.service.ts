/**
 * MONOLITH (Before): Console.log scattered across services
 * MICROSERVICES (After): Structured JSON logger with correlation IDs for distributed tracing
 * Scale Target: 100k+ users, 10+ developers, multi-region
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  correlationId?: string;
  userId?: string;
  service?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export class LoggerService {
  private readonly serviceName: string;
  private readonly minLevel: LogLevel;

  constructor(serviceName: string, minLevel: LogLevel = LogLevel.INFO) {
    this.serviceName = serviceName;
    this.minLevel = minLevel;
  }

  private format(level: string, message: string, metadata?: Record<string, unknown>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      service: this.serviceName,
      ...metadata,
    };
  }

  private output(entry: LogEntry): void {
    const line = JSON.stringify(entry);
    if (entry.level === 'ERROR') {
      console.error(`[${entry.level}] ${line}`);
    } else if (entry.level === 'WARN') {
      console.warn(`[${entry.level}] ${line}`);
    } else {
      console.log(`[${entry.level}] ${line}`);
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    if (this.minLevel <= LogLevel.DEBUG) {
      this.output(this.format('DEBUG', message, metadata));
    }
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    if (this.minLevel <= LogLevel.INFO) {
      this.output(this.format('INFO', message, metadata));
    }
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    if (this.minLevel <= LogLevel.WARN) {
      this.output(this.format('WARN', message, metadata));
    }
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    if (this.minLevel <= LogLevel.ERROR) {
      this.output(this.format('ERROR', message, metadata));
    }
  }

  logRequest(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    correlationId?: string,
    userId?: string,
  ): void {
    this.info('HTTP Request', {
      correlationId,
      userId,
      method,
      path,
      statusCode,
      duration,
    });
  }
}
