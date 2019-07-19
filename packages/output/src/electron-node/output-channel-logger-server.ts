/********************************************************************************
 * Copyright (C) 2017 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { inject, injectable, postConstruct } from 'inversify';
import { LogLevel } from '@theia/core/lib/common/logger';
import { ConsoleLoggerServer } from '@theia/core/lib/node/console-logger-server';
import { OutputChannelServiceImpl, LogOutputChannel } from './output-channel-service-impl';

@injectable()
export class OutputChannelLoggerServer extends ConsoleLoggerServer {

    @inject(OutputChannelServiceImpl)
    protected loggerService: OutputChannelServiceImpl;

    protected outputChannel: LogOutputChannel;

    @postConstruct()
    protected init() {
        super.init();
        this.outputChannel = this.loggerService.getChannel('Log (IDE Backend)', 'log');
    }

    // tslint:disable:no-any
    async log(name: string, logLevel: number, message: any, params: any[]): Promise<void> {
        super.log(name, logLevel, message, params);
        const configuredLogLevel = await this.getLogLevel(name);
        if (logLevel >= configuredLogLevel) {
            this.logToOutput(name, logLevel, message, params);
        }
    }

    protected logToOutput(name: string, logLevel: number, message: any, params: any[]): void {
        const messages: string[] = [];
        if (typeof message === 'string') {
            messages.push(message);
        } else if (message instanceof Array) {
            messages.push(...message);
        } else {
            messages.push(JSON.stringify(message));
        }

        for (const m of messages) {
            const severity = (LogLevel.strings.get(logLevel) || 'unknown').toUpperCase();
            this.outputChannel.appendLine(`${name} ${severity} ${m}`);
        }
    }

}
