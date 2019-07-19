/********************************************************************************
 * Copyright (C) 2019 Arm and others.
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

export const OutputChannelServicePath = '/services/output-channel';
export const OutputChannelService = Symbol('OutputChannelService');
export interface OutputChannelService {
    list(options?: { visibleOnly?: boolean }): Promise<ReadonlyArray<ChannelDescriptor>>;
    delete(name: string): Promise<boolean>;
    select(name: string): Promise<boolean>;
    selected(): Promise<ChannelDescriptor | undefined>;
    appendLine(channel: string | ChannelDescriptor, message: string): Promise<void>;
}

export interface ChannelDescriptor {
    readonly name: string;
    // readonly group: string;
    readonly visible: boolean;
}
