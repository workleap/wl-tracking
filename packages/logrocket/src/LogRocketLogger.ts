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

/**
 * An scope implementation for the LogRocket logger.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class LogRocketLoggerScope implements LoggerScope {
    readonly #logLevel: LogLevel;
    readonly #label: string;

    #segments: Segment[] = [];
    #pendingLogs: PendingLog[] = [];
    #hasEnded: boolean = false;

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
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

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withText(text: string, options: LogOptions = {}) {
        this.#segments.push({
            text,
            options
        });

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withError(error: Error) {
        this.#segments.push({
            error
        });

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withObject(obj: object) {
        this.#segments.push({
            obj
        });

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    debug(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.log, LogLevel.debug);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    information(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.log, LogLevel.information);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    warning(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.warn, LogLevel.warning);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    error(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.error, LogLevel.error);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    critical(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.error, LogLevel.critical);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
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

/**
 * A logger implementation for LogRocket.
 * @see {@link https://workleap.github.io/wl-telemetry}
 */
export class LogRocketLogger implements Logger {
    readonly #logLevel: LogLevel;
    #segments: Segment[] = [];

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
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
                const parsedSegments = parseSegments(this.#segments);

                fct(...parsedSegments);
            }

            this.#resetSegments();
        }
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    getName() {
        return LogRocketLogger.name;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withText(text: string, options: LogOptions = {}) {
        this.#segments.push({
            text,
            options
        });

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withError(error: Error) {
        this.#segments.push({
            error
        });

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    withObject(obj: object) {
        this.#segments.push({
            obj
        });

        return this;
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    debug(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.log, LogLevel.debug);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    information(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.log, LogLevel.information);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    warning(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.warn, LogLevel.warning);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    error(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.error, LogLevel.error);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    critical(log?: string, options?: LogOptions) {
        if (log) {
            this.#segments.push({
                text: log,
                options
            });
        }

        this.#log(LogRocket.error, LogLevel.critical);
    }

    /**
     * @see {@link https://workleap.github.io/wl-logging}
     */
    startScope(label: string) {
        return new LogRocketLoggerScope(label, this.#logLevel);
    }
}
