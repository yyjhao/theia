/********************************************************************************
 * Copyright (C) 2018 TypeFox and others.
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

import { inject, injectable } from 'inversify';
import {
    Range,
    Position,
    EditorDecoration,
    EditorDecorationOptions,
    OverviewRulerLane,
    EditorDecorator,
    TextEditor,
    MinimapPosition
} from '@theia/editor/lib/browser';
import { DirtyDiff, LineRange } from './diff-computer';
import { ColorRegistry } from '@theia/core/lib/browser/color-registry';

export enum DirtyDiffDecorationType {
    AddedLine = 'dirty-diff-added-line',
    RemovedLine = 'dirty-diff-removed-line',
    ModifiedLine = 'dirty-diff-modified-line',
}

export interface DirtyDiffUpdate extends DirtyDiff {
    readonly editor: TextEditor;
}

@injectable()
export class DirtyDiffDecorator extends EditorDecorator {

    @inject(ColorRegistry)
    protected readonly colorRegistry: ColorRegistry;

    applyDecorations(update: DirtyDiffUpdate): void {
        const modifications = update.modified.map(range => this.toDeltaDecoration(range, this.getModifiedLineDecorationOptions()));
        const additions = update.added.map(range => this.toDeltaDecoration(range, this.getAddedLineDecorationOptions()));
        const deletions = update.removed.map(line => this.toDeltaDecoration(line, this.getDeletionLineDecorationOptions()));
        const decorations = [...modifications, ...additions, ...deletions];
        this.setDecorations(update.editor, decorations);
    }

    protected toDeltaDecoration(from: LineRange | number, options: EditorDecorationOptions): EditorDecoration {
        const [start, end] = (typeof from === 'number') ? [from, from] : [from.start, from.end];
        const range = Range.create(Position.create(start, 0), Position.create(end, 0));
        return { range, options };
    }

    /**
     * Get the modified line decoration.
     *
     * @returns the editor decoration options for modifications.
     */
    protected getModifiedLineDecorationOptions(): EditorDecorationOptions {
        return <EditorDecorationOptions>{
            linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-modified-line',
            overviewRuler: {
                color: this.colorRegistry.getCurrentColor('editorOverviewRuler.modifiedForeground'),
                position: OverviewRulerLane.Left,
            },
            minimap: {
                color: this.colorRegistry.getCurrentColor('minimapGutter.modifiedBackground'),
                position: MinimapPosition.Gutter
            },
            isWholeLine: true
        };
    }

    /**
     * Get the added line decoration.
     *
     * @returns the editor decoration options for additions.
     */
    protected getAddedLineDecorationOptions(): EditorDecorationOptions {
        return <EditorDecorationOptions>{
            linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-added-line',
            overviewRuler: {
                color: this.colorRegistry.getCurrentColor('editorOverviewRuler.addedForeground'),
                position: OverviewRulerLane.Left,
            },
            minimap: {
                color: this.colorRegistry.getCurrentColor('minimapGutter.addedBackground'),
                position: MinimapPosition.Gutter
            },
            isWholeLine: true
        };
    }

    /**
     * Get the deletion line decoration.
     *
     * @returns the editor decoration options for deletions.
     */
    protected getDeletionLineDecorationOptions(): EditorDecorationOptions {
        return <EditorDecorationOptions>{
            linesDecorationsClassName: 'dirty-diff-glyph dirty-diff-removed-line',
            overviewRuler: {
                color: this.colorRegistry.getCurrentColor('editorOverviewRuler.deletedForeground'),
                position: OverviewRulerLane.Left,
            },
            minimap: {
                color: this.colorRegistry.getCurrentColor('minimapGutter.deletedBackground'),
                position: MinimapPosition.Gutter
            },
            isWholeLine: false
        };
    }
}
