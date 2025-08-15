import { type Logger, type LoggerOptions, type LoggerScope, type LoggerScopeEndOptions, LogLevel, type LogOptions, type Segment } from "@workleap/logging";
import LogRocket from "logrocket";

type LogFunction = (...rest: unknown[]) => void;
type PendingLog = () => void;

function parseSegments(segments: Segment[]) {
    return segments.reduce<unknown[]>((acc, x) => {
        if (x.text) {
            acc.push(x.text);
        } else if (x.obj) {
            acc.push(x.obj);
        } else if (x.error) {
            acc.push(x.error);
        }

        return acc;
    }, []);
}

export class LogRocketLoggerScope implements LoggerScope {
    readonly #logLevel: LogLevel;
    readonly #label: string;

    #segments: Segment[] = [];
    #pendingLogs: PendingLog[] = [];
    #hasEnded: boolean = false;

    constructor(label: string, logLevel: LogLevel) {
        this.#logLevel = logLevel;
        this.#label = label;
    }

    #resetSegments() {
        this.#segments = [];
    }

    #log(fct: LogFunction, threshold: LogLevel) {
        if (this.#segments.length > 0) {
            if (this.#logLevel <= threshold) {
                // Required closure to preserved the current log items for when they will be formatted when the scope is ended.
                const segments = this.#segments;

                this.#pendingLogs.push(() => {
                    const parsedSegments = parseSegments(segments);
                    parsedSegments.unshift(`(${this.#label})`);

                    fct(...parsedSegments);
                });
            }

            this.#resetSegments();
        }
    }

    withText(text: string, options: LogOptions = {}) {
        this.#segments.push({
            text,
            options
        });

        return this;
    }

    withError(error: Error) {
        this.#segments.push({
            error
        });

        return this;
    }

    withObject(obj: object) {
        this.#segments.push({
            obj
        });

        return this;
    }

    debug(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.log, LogLevel.debug);
    }

    information(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.log, LogLevel.information);
    }

    warning(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.warn, LogLevel.warning);
    }

    error(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.error, LogLevel.error);
    }

    critical(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.error, LogLevel.critical);
    }

    end(options: LoggerScopeEndOptions = {}) {
        const {
            dismiss = false
        } = options;

        if (!this.#hasEnded) {
            this.#hasEnded = true;

            if (!dismiss) {
                if (this.#pendingLogs.length > 0) {
                    this.#pendingLogs.forEach(x => {
                        x();
                    });

                    this.#pendingLogs = [];
                }
            }
        }
    }
}

export class LogRocketLogger implements Logger {
    readonly #logLevel: LogLevel;
    #segments: Segment[] = [];

    constructor(options: LoggerOptions = {}) {
        const {
            logLevel = LogLevel.debug
        } = options;

        this.#logLevel = logLevel;
    }

    #resetSegments() {
        this.#segments = [];
    }

    #log(fct: LogFunction, threshold: LogLevel) {
        if (this.#segments.length > 0) {
            if (this.#logLevel <= threshold) {
                const segments = parseSegments(this.#segments);

                fct(...segments);
            }

            this.#resetSegments();
        }
    }

    getName() {
        return LogRocketLogger.name;
    }

    withText(text: string, options: LogOptions = {}) {
        this.#segments.push({
            text,
            options
        });

        return this;
    }

    withError(error: Error) {
        this.#segments.push({
            error
        });

        return this;
    }

    withObject(obj: object) {
        this.#segments.push({
            obj
        });

        return this;
    }

    debug(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.log, LogLevel.debug);
    }

    information(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.log, LogLevel.information);
    }

    warning(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.warn, LogLevel.warning);
    }

    error(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.error, LogLevel.error);
    }

    critical(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.error, LogLevel.critical);
    }

    startScope(label: string) {
        return new LogRocketLoggerScope(label, this.#logLevel);
    }
}
