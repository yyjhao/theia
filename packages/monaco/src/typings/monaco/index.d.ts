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

/* eslint-disable @typescript-eslint/no-explicit-any */
/// <reference types='@theia/monaco-editor-core/monaco'/>

declare module monaco.instantiation {
    export interface IInstantiationService {
        invokeFunction: (fn: any, ...args: any) => any
    }
}

declare module monaco.editor {

    export interface IBulkEditResult {
        ariaSummary: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/services/bulkEditService.ts#L23
    export interface IBulkEditService {
        apply(edit: monaco.languages.WorkspaceEdit): Promise<IBulkEditResult>;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/widget/diffNavigator.ts#L43
    export interface IDiffNavigator {
        readonly ranges: IDiffRange[];
        readonly nextIdx: number;
        readonly revealFirst: boolean;
        _initIdx(fwd: boolean): void;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/widget/diffNavigator.ts#L16
    export interface IDiffRange {
        readonly range: Range;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/standaloneCodeEditor.ts#L205
    export interface IStandaloneCodeEditor extends CommonCodeEditor {
        setDecorations(decorationTypeKey: string, ranges: IDecorationOptions[]): void;
        setDecorationsFast(decorationTypeKey: string, ranges: IRange[]): void;
        trigger(source: string, handlerId: string, payload: any): void
        _standaloneKeybindingService: {
            _store: {
                _toDispose: monaco.IDisposable[]
            }
            resolveKeybinding(keybinding: monaco.keybindings.ChordKeybinding): monaco.keybindings.ResolvedKeybinding[];
            resolveKeyboardEvent(keyboardEvent: monaco.IKeyboardEvent): monaco.keybindings.ResolvedKeybinding;
        }
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/widget/codeEditorWidget.ts#L104
    export interface CommonCodeEditor {
        readonly _commandService: monaco.commands.ICommandService;
        readonly _instantiationService: monaco.instantiation.IInstantiationService;
        readonly _contributions: {
            'editor.controller.quickOpenController': monaco.quickOpen.QuickOpenController
            'editor.contrib.referencesController': monaco.referenceSearch.ReferencesController
        }
        readonly _modelData: {
            cursor: ICursor
        } | null;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/controller/cursor.ts#L169
    export interface ICursor {
        trigger(source: string, handlerId: string, payload: any): void;
    }

    export interface IEditorOverrideServices {
        codeEditorService?: ICodeEditorService;
        textModelService?: ITextModelService;
        contextMenuService?: IContextMenuService;
        commandService?: monaco.commands.ICommandService;
        IWorkspaceEditService?: IBulkEditService;
        contextKeyService?: monaco.contextKeyService.IContextKeyService;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/editor/common/editor.ts#L63
    export interface IResourceInput {
        resource: monaco.Uri;
        options?: IResourceInputOptions;
    }

    export interface IResourceInputOptions {
        /**
         * Tells the editor to not receive keyboard focus when the editor is being opened. By default,
         * the editor will receive keyboard focus on open.
         */
        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/editor/common/editor.ts#L132
        preserveFocus?: boolean;

        /**
         * Will reveal the editor if it is already opened and visible in any of the opened editor groups.
         */
        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/editor/common/editor.ts#L157
        revealIfVisible?: boolean;

        /**
         * Text editor selection.
         */
        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/editor/common/editor.ts#L223
        selection?: Partial<monaco.IRange>;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/services/codeEditorService.ts#L15
    export interface ICodeEditorService {
        getActiveCodeEditor(): monaco.editor.ICodeEditor | undefined;
        openCodeEditor(input: monaco.editor.IResourceInput, source?: monaco.editor.ICodeEditor, sideBySide?: boolean): Promise<monaco.editor.CommonCodeEditor | undefined>;
        registerDecorationType(key: string, options: IDecorationRenderOptions, parentTypeKey?: string): void;
        removeDecorationType(key: string): void;
        resolveDecorationOptions(typeKey: string, writable: boolean): IModelDecorationOptions;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/lifecycle.ts#L209
    export interface IReference<T> extends monaco.IDisposable {
        readonly object: T;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/services/resolverService.ts#L14
    export interface ITextModelService {
        /**
         * Provided a resource URI, it will return a model reference
         * which should be disposed once not needed anymore.
         */
        createModelReference(resource: monaco.Uri): Promise<IReference<ITextEditorModel>>;

        /**
         * Registers a specific `scheme` content provider.
         */
        registerTextModelContentProvider(scheme: string, provider: ITextModelContentProvider): monaco.IDisposable;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/services/resolverService.ts#L34
    export interface ITextModelContentProvider {
        /**
         * Given a resource, return the content of the resource as IModel.
         */
        provideTextContent(resource: monaco.Uri): Promise<monaco.editor.IModel | null> | null;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/services/resolverService.ts#L42 &&
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/editor/common/editor.ts#L9
    export interface ITextEditorModel {
        onDispose: monaco.IEvent<void>;
        /**
         * Loads the model.
         */
        load(): Promise<ITextEditorModel>;

        /**
         * Dispose associated resources
         */
        dispose(): void;
        /**
         * Provides access to the underlying IModel.
         */
        textEditorModel: monaco.editor.IModel;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/browser/contextmenu.ts#L25
    export interface IContextMenuDelegate {
        /**
         * Returns with an HTML element or the client coordinates as the anchor of the context menu to open.
         */
        getAnchor(): HTMLElement | { x: number; y: number; width?: number; height?: number };

        /**
         * Returns the actions for the menu
         */
        getActions(): ReadonlyArray<IAction>;

        /**
         * Needs to be called with the context menu closes again.
         */
        onHide(wasCancelled: boolean): void
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/actions.ts#L25
    export interface IAction extends IDisposable {
        readonly id: string;
        label: string;
        tooltip: string;
        class: string | undefined;
        enabled: boolean;
        checked: boolean;
        run(event?: any): Promise<any>;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/contextview/browser/contextView.ts#L38
    export interface IContextMenuService {
        /**
         * Shows the native Monaco context menu in the editor.
         */
        showContextMenu(delegate: IContextMenuDelegate): void;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/editorCommon.ts#L615
    export interface IDecorationOptions {
        range: IRange;
        hoverMessage?: IMarkdownString | IMarkdownString[];
        renderOptions?: IDecorationInstanceRenderOptions;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/editorCommon.ts#L599
    export interface IThemeDecorationInstanceRenderOptions {
        before?: IContentDecorationRenderOptions;
        after?: IContentDecorationRenderOptions;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/editorCommon.ts#L607
    export interface IDecorationInstanceRenderOptions extends IThemeDecorationInstanceRenderOptions {
        light?: IThemeDecorationInstanceRenderOptions;
        dark?: IThemeDecorationInstanceRenderOptions;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/editorCommon.ts#L567
    export interface IContentDecorationRenderOptions {
        contentText?: string;
        contentIconPath?: UriComponents;

        border?: string;
        borderColor?: string | ThemeColor;
        fontStyle?: string;
        fontWeight?: string;
        textDecoration?: string;
        color?: string | ThemeColor;
        opacity?: string; // does not exist in vs code
        backgroundColor?: string | ThemeColor;

        margin?: string;
        width?: string;
        height?: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/editorCommon.ts#L587
    export interface IDecorationRenderOptions extends IThemeDecorationRenderOptions {
        isWholeLine?: boolean;
        rangeBehavior?: TrackedRangeStickiness;
        overviewRulerLane?: OverviewRulerLane;

        light?: IThemeDecorationRenderOptions;
        dark?: IThemeDecorationRenderOptions;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/editorCommon.ts#L532
    export interface IThemeDecorationRenderOptions {
        backgroundColor?: string | ThemeColor;

        outline?: string;
        outlineColor?: string | ThemeColor;
        outlineStyle?: string;
        outlineWidth?: string;

        border?: string;
        borderColor?: string | ThemeColor;
        borderRadius?: string;
        borderSpacing?: string;
        borderStyle?: string;
        borderWidth?: string;

        fontStyle?: string;
        fontWeight?: string;
        textDecoration?: string;
        cursor?: string;
        color?: string | ThemeColor;
        opacity?: string;
        letterSpacing?: string;

        gutterIconPath?: UriComponents;
        gutterIconSize?: string;

        overviewRulerColor?: string | ThemeColor;

        before?: IContentDecorationRenderOptions;
        after?: IContentDecorationRenderOptions;
    }
}

declare module monaco.commands {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/commands/common/commands.ts#L55
    export const CommandsRegistry: {
        getCommands(): Map<string, { id: string, handler: (...args: any) => any }>;
    };

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/commands/common/commands.ts#L16
    export interface ICommandEvent {
        commandId: string;
        args: any[];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/commands/common/commands.ts#L21
    export interface ICommandService {
        onWillExecuteCommand: monaco.Event<ICommandEvent>;
        onDidExecuteCommand: monaco.Event<ICommandEvent>;
        executeCommand<T = any>(commandId: string, ...args: any[]): Promise<T | undefined>;
    }

}

declare module monaco.actions {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/actions/common/actions.ts#L17
    export interface ILocalizedString {
        value: string;
        original: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/actions/common/actions.ts#L22
    export interface ICommandAction {
        id: string;
        title: string
        category?: string;
        icon?: { dark?: monaco.Uri; light?: monaco.Uri; } | monaco.theme.ThemeIcon;
        precondition?: monaco.contextkey.ContextKeyExpr;
        toggled?: monaco.contextkey.ContextKeyExpr;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/actions/common/actions.ts#L35
    export interface IMenuItem {
        command: ICommandAction;
        when?: monaco.contextkey.ContextKeyExpr;
        group?: 'navigation' | string;
        order?: number;
        alt?: ICommandAction;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/actions/common/actions.ts#L43
    export interface ISubmenuItem {
        title: string | ILocalizedString;
        submenu: number; // enum MenuId
        when?: monaco.contextkey.ContextKeyExpr;
        group?: 'navigation' | string;
        order?: number;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/actions/common/actions.ts#L133
    export interface IMenuRegistry {
        /**
         * Retrieves all the registered menu items for the given menu.
         * @param menuId - see https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/actions/common/actions.ts#L67
         */
        getMenuItems(menuId: 7 /* EditorContext */ | 8 /* EditorContextPeek */): IMenuItem[];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/actions/common/actions.ts#L51
    export function isIMenuItem(item: IMenuItem | ISubmenuItem): item is IMenuItem;

    /**
     * The shared menu registry singleton.
     */
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/actions/common/actions.ts#L142
    export const MenuRegistry: IMenuRegistry;
}

declare module monaco.platform {
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/platform.ts#L206
    export const enum OperatingSystem {
        Windows = 1,
        Macintosh = 2,
        Linux = 3
    }
    export const OS: OperatingSystem;
}

declare module monaco.keybindings {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/keybinding/common/keybindingResolver.ts#L20
    export class KeybindingResolver {
        static contextMatchesRules(context: monaco.contextKeyService.IContext, rules: monaco.contextkey.ContextKeyExpr | null | undefined): boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keyCodes.ts#L443
    export class SimpleKeybinding {
        public readonly ctrlKey: boolean;
        public readonly shiftKey: boolean;
        public readonly altKey: boolean;
        public readonly metaKey: boolean;
        public readonly keyCode: KeyCode;

        constructor(ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean, keyCode: KeyCode);
        toChord(): ChordKeybinding;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keyCodes.ts#L503
    export class ChordKeybinding {
        readonly parts: SimpleKeybinding[];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keyCodes.ts#L540
    export type Keybinding = ChordKeybinding;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/keybinding/common/keybindingsRegistry.ts#L12
    export interface IKeybindingItem {
        keybinding: Keybinding;
        command: string;
        when?: monaco.contextkey.ContextKeyExpr;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/keybinding/common/keybindingsRegistry.ts#L69
    export interface IKeybindingsRegistry {
        /**
         * Returns with all the default, static keybindings.
         */
        getDefaultKeybindings(): IKeybindingItem[];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/keybinding/common/keybindingsRegistry.ts#L76
    export const KeybindingsRegistry: IKeybindingsRegistry;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keyCodes.ts#L542
    export class ResolvedKeybindingPart {
        readonly ctrlKey: boolean;
        readonly shiftKey: boolean;
        readonly altKey: boolean;
        readonly metaKey: boolean;

        readonly keyLabel: string | null;
        readonly keyAriaLabel: string | null;

        constructor(ctrlKey: boolean, shiftKey: boolean, altKey: boolean, metaKey: boolean, kbLabel: string | null, kbAriaLabel: string | null);
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keyCodes.ts#L564
    export abstract class ResolvedKeybinding {
        public abstract getLabel(): string | null;
        public abstract getAriaLabel(): string | null;
        public abstract getElectronAccelerator(): string | null;
        public abstract getUserSettingsLabel(): string | null;
        public abstract isWYSIWYG(): boolean;
        public abstract isChord(): boolean;
        public abstract getParts(): ResolvedKeybindingPart[];
        public abstract getDispatchParts(): (string | null)[];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/keybinding/common/usLayoutResolvedKeybinding.ts#L13
    export class USLayoutResolvedKeybinding {
        public static getDispatchStr(keybinding: SimpleKeybinding): string | null;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keybindingLabels.ts#L17
    export interface Modifiers {
        readonly ctrlKey: boolean;
        readonly shiftKey: boolean;
        readonly altKey: boolean;
        readonly metaKey: boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keybindingLabels.ts#L24
    export interface KeyLabelProvider<T extends Modifiers> {
        (keybinding: T): string | null;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keybindingLabels.ts#L28
    export interface ModifierLabelProvider {
        toLabel<T extends Modifiers>(OS: monaco.platform.OperatingSystem, parts: T[], keyLabelProvider: KeyLabelProvider<T>): string | null;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keybindingLabels.ts#L61
    export const UILabelProvider: ModifierLabelProvider;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keybindingLabels.ts#L88
    export const AriaLabelProvider: ModifierLabelProvider;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keybindingLabels.ts#L116
    export const ElectronAcceleratorLabelProvider: ModifierLabelProvider;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/keybindingLabels.ts#L136
    export const UserSettingsLabelProvider: ModifierLabelProvider;

}

declare module monaco.services {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/standaloneLanguages.ts#L101
    export class TokenizationSupport2Adapter implements monaco.modes.ITokenizationSupport {
        constructor(standaloneThemeService: IStandaloneThemeService, languageIdentifier: LanguageIdentifier, actual: monaco.languages.TokensProvider)
        tokenize(line: string, state: monaco.languages.IState, offsetDelta: number): any;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/services/codeEditorService.ts#L13
    export const ICodeEditorService: any;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/configuration/common/configuration.ts#L16
    export const IConfigurationService: any;

    export interface Configuration {
        getValue(section: string, overrides: any, workspace: any): any;
    }

    export class ConfigurationChangeEvent {
        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/configuration/common/configuration.ts#L30-L37
        _source?: number;

        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/configuration/common/configurationModels.ts#L620
        change(keys: string[]): ConfigurationChangeEvent;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/configuration/common/configuration.ts#L65
    export interface IConfigurationService {
        _onDidChangeConfiguration: monaco.Emitter<ConfigurationChangeEvent>;
        _configuration: Configuration;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/services/resourceConfiguration.ts#L39
    export interface ITextResourcePropertiesService {
        getEOL(resource: monaco.Uri | undefined, language?: string): string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/services/codeEditorServiceImpl.ts#L17
    export abstract class CodeEditorServiceImpl implements monaco.editor.ICodeEditorService {
        constructor(themeService: IStandaloneThemeService);
        abstract getActiveCodeEditor(): monaco.editor.ICodeEditor | undefined;
        abstract openCodeEditor(input: monaco.editor.IResourceInput, source?: monaco.editor.ICodeEditor,
            sideBySide?: boolean): Promise<monaco.editor.CommonCodeEditor | undefined>;
        registerDecorationType: monaco.editor.ICodeEditorService['registerDecorationType'];
        removeDecorationType: monaco.editor.ICodeEditorService['removeDecorationType'];
        resolveDecorationOptions: monaco.editor.ICodeEditorService['resolveDecorationOptions'];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/simpleServices.ts#L245
    export class StandaloneCommandService implements monaco.commands.ICommandService {
        constructor(instantiationService: monaco.instantiation.IInstantiationService);
        private readonly _onWillExecuteCommand: monaco.Emitter<monaco.commands.ICommandEvent>;
        private readonly _onDidExecuteCommand: monaco.Emitter<monaco.commands.ICommandEvent>;

        executeCommand<T>(commandId: string, ...args: any[]): Promise<T>;
        executeCommand(commandId: string, ...args: any[]): Promise<any>;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/standaloneServices.ts#L60
    export class LazyStaticService<T> {
        get(overrides?: monaco.editor.IEditorOverrideServices): T;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/common/standaloneThemeService.ts#L28
    export interface IStandaloneThemeService extends monaco.theme.IThemeService {
        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/standaloneThemeServiceImpl.ts#L170
        readonly _knownThemes: Map<string, IStandaloneTheme>;

        getTheme(): IStandaloneTheme;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/common/standaloneThemeService.ts#L23
    export interface IStandaloneTheme {
        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/standaloneThemeServiceImpl.ts#L30
        themeData: monaco.editor.IStandaloneThemeData

        tokenTheme: TokenTheme;

        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/themeService.ts#L91
        getColor(color: string): monaco.color.Color | undefined;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes/supports/tokenization.ts#L188
    export interface TokenTheme {
        match(languageId: LanguageId, scope: string): number;
        getColorMap(): monaco.color.Color[];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L27
    export const enum LanguageId {
        Null = 0,
        PlainText = 1
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L35
    export class LanguageIdentifier {
        public readonly id: LanguageId;
        readonly language: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L58
    export interface IMode {
        getId(): string;
        getLanguageIdentifier(): LanguageIdentifier;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/services/modeService.ts#L30
    export interface IModeService {
        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/services/modeServiceImpl.ts#L46
        private readonly _instantiatedModes: { [modeId: string]: IMode; };
        readonly onDidCreateMode: monaco.IEvent<IMode>;
        createByFilepathOrFirstLine(rsource: monaco.Uri | null, firstLine?: string): ILanguageSelection;
        getLanguageIdentifier(modeId: string | LanguageId): LanguageIdentifier | null;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/services/modeService.ts#L25
    export interface ILanguageSelection {
        readonly languageIdentifier: LanguageIdentifier;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/instantiation/common/serviceCollection.ts#L9
    export interface ServiceCollection {
        set<T>(id: any, instanceOrDescriptor: T): T;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/markers/common/markers.ts#L12
    export interface IMarkerService {
        read(filter?: { owner?: string; resource?: monaco.Uri; severities?: number, take?: number; }): editor.IMarker[];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/standaloneServices.ts#L56
    export module StaticServices {
        export function init(overrides: monaco.editor.IEditorOverrideServices): [ServiceCollection, monaco.instantiation.IInstantiationService];
        export const standaloneThemeService: LazyStaticService<IStandaloneThemeService>;
        export const modeService: LazyStaticService<IModeService>;
        export const codeEditorService: LazyStaticService<monaco.editor.ICodeEditorService>;
        export const configurationService: LazyStaticService<IConfigurationService>;
        export const resourcePropertiesService: LazyStaticService<ITextResourcePropertiesService>;
        export const instantiationService: LazyStaticService<monaco.instantiation.IInstantiationService>;
        export const markerService: LazyStaticService<IMarkerService>;
    }
}

declare module monaco.theme {
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/themeService.ts#L82
    export interface ITheme { }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/themeService.ts#L124
    export interface IThemeService {
        readonly onThemeChange: monaco.IEvent<ITheme>;
    }
    export interface IThemable { }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/styler.ts#L166
    export function attachQuickOpenStyler(widget: IThemable, themeService: IThemeService): monaco.IDisposable;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/themeService.ts#L25
    export interface ThemeIcon {
        readonly id: string;
    }
}

declare module monaco.color {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/color.ts#L13
    export class RGBA {
        readonly r: number;
        readonly g: number;
        readonly b: number;
        readonly a: number;

        constructor(r: number, g: number, b: number, a?: number);
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/color.ts#L48
    export class HSLA {
        readonly h: number;
        readonly s: number;
        readonly l: number;
        readonly a: number;

        constructor(h: number, s: number, l: number, a: number);
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/color.ts#L256
    export class Color {
        readonly rgba: RGBA;

        constructor(arg: RGBA | HSLA);
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L20
    export interface ColorContribution {
        readonly id: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L29
    export type ColorFunction = (theme: monaco.theme.ITheme) => Color | undefined;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L42
    export type ColorValue = string | Color | ColorFunction;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L33
    export interface ColorDefaults {
        light?: ColorValue;
        dark?: ColorValue;
        hc?: ColorValue;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L49
    export interface IColorRegistry {
        getColors(): ColorContribution[];
        registerColor(id: string, defaults: ColorDefaults | undefined, description: string): string;
        deregisterColor(id: string): void;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L173
    export function getColorRegistry(): IColorRegistry;
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L434
    export function darken(colorValue: ColorValue, factor: number): ColorFunction;
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L444
    export function lighten(colorValue: ColorValue, factor: number): ColorFunction;
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/theme/common/colorRegistry.ts#L454
    export function transparent(colorValue: ColorValue, factor: number): ColorFunction;
}

declare module monaco.referenceSearch {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L749
    export interface Location {
        uri: Uri,
        range: IRange
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/gotoSymbol/referencesModel.ts#L20
    export interface OneReference { }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/gotoSymbol/referencesModel.ts#L148
    export interface ReferencesModel implements IDisposable {
        references: OneReference[]
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/gotoSymbol/peek/referencesWidget.ts#L187
    export interface ReferenceWidget {
        show(range: IRange): void;
        hide(): void;
        focus(): void;
        _tree: ReferenceTree
    }
    export interface ReferenceTree {
        getFocus(): ReferenceTreeElement[]
    }
    export interface ReferenceTreeElement { }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/gotoSymbol/peek/referencesController.ts#L30
    export interface ReferencesController extends IDisposable {
        static readonly ID: string;
        _widget?: ReferenceWidget;
        _model?: ReferencesModel;
        _ignoreModelChangeEvent: boolean;
        _editorService: monaco.editor.ICodeEditorService;
        closeWidget(): void;
        _gotoReference(ref: Location): Promise<any>;
        toggleWidget(range: IRange, modelPromise: Promise<ReferencesModel> & { cancel: () => void }, peekMode: boolean): void;
    }
}

declare module monaco.quickOpen {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/browser/ui/inputbox/inputBox.ts#L59
    export interface IMessage {
        content: string;
        formatContent?: boolean; // defaults to false
        type?: 1 /* INFO */ | 2  /* WARNING */ | 3 /* ERROR */;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/browser/ui/inputbox/inputBox.ts#L91
    export class InputBox {
        inputElement: HTMLInputElement;
        setPlaceHolder(placeHolder: string): void;
        showMessage(message: IMessage, force?: boolean): void;
        hideMessage(): void;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenWidget.ts#L96
    export class QuickOpenWidget implements IDisposable {
        inputBox?: InputBox;
        constructor(container: HTMLElement, callbacks: IQuickOpenCallbacks, options: IQuickOpenOptions);
        dispose(): void;
        create(): HTMLElement;
        setInput(input: IModel<any>, autoFocus?: IAutoFocus, ariaLabel?: string): void;
        layout(dimension: monaco.editor.IDimension): void;
        show(prefix: string, options?: IShowOptions): void;
        show(input: IModel<any>, options?: IShowOptions): void;
        hide(reason?: HideReason): void;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenWidget.ts#L79
    export enum HideReason {
        ELEMENT_SELECTED,
        FOCUS_LOST,
        CANCELED
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenWidget.ts#L28
    export interface IQuickOpenCallbacks {
        onOk: () => void;
        onCancel: () => void;
        onType: (lookFor: string) => void;
        onShow?: () => void;
        onHide?: (reason: HideReason) => void;
        onFocusLost?: () => boolean /* veto close */;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenWidget.ts#L37
    export interface IQuickOpenOptions /* extends IQuickOpenStyles */ {
        minItemsToShow?: number;
        maxItemsToShow?: number;
        inputPlaceHolder?: string;
        inputAriaLabel?: string;
        actionProvider?: IActionProvider;
        keyboardSupport?: boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenWidget.ts#L57
    export interface IShowOptions {
        quickNavigateConfiguration?: IQuickNavigateConfiguration;
        autoFocus?: IAutoFocus;
        inputSelection?: IRange;
        value?: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L8
    export interface IQuickNavigateConfiguration {
        keybindings: monaco.keybindings.ResolvedKeybinding[];
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L12
    export interface IAutoFocus {

        /**
         * The index of the element to focus in the result list.
         */
        autoFocusIndex?: number;

        /**
         * If set to true, will automatically select the first entry from the result list.
         */
        autoFocusFirstEntry?: boolean;

        /**
         * If set to true, will automatically select the second entry from the result list.
         */
        autoFocusSecondEntry?: boolean;

        /**
         * If set to true, will automatically select the last entry from the result list.
         */
        autoFocusLastEntry?: boolean;

        /**
         * If set to true, will automatically select any entry whose label starts with the search
         * value. Since some entries to the top might match the query but not on the prefix, this
         * allows to select the most accurate match (matching the prefix) while still showing other
         * elements.
         */
        autoFocusPrefixMatch?: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L43-L47
    export type Mode = 0 /* PREVIEW */ | 1 /* OPEN */ | 2 /* OPEN_IN_BACKGROUND */;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L49
    export interface IEntryRunContext {
        event: any;
        keymods: IKeyMods;
        quickNavigateConfiguration: IQuickNavigateConfiguration | undefined;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L55
    export interface IKeyMods {
        ctrlCmd: boolean;
        alt: boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L60
    export interface IDataSource<T> {
        getId(entry: T): string;
        getLabel(entry: T): string | null;
    }
    /**
     * See vs/base/parts/tree/browser/tree.ts - IRenderer
     */
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L68
    export interface IRenderer<T> {
        getHeight(entry: T): number;
        getTemplateId(entry: T): string;
        renderTemplate(templateId: string, container: HTMLElement, styles: any): any;
        renderElement(entry: T, templateId: string, templateData: any, styles: any): void;
        disposeTemplate(templateId: string, templateData: any): void;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L78
    export interface IFilter<T> {
        isVisible(entry: T): boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L82
    export interface IAccessiblityProvider<T> {
        getAriaLabel(entry: T): string;
    }
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L86
    export interface IRunner<T> {
        run(entry: T, mode: Mode, context: IEntryRunContext): boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/common/quickOpen.ts#L90
    export interface IModel<T> {
        entries: T[];
        dataSource: IDataSource<T>;
        renderer: IRenderer<T>;
        runner: IRunner<T>;
        filter?: IFilter<T>;
        accessibilityProvider?: IAccessiblityProvider<T>;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenModel.ts#L29
    export interface IHighlight {
        start: number;
        end: number;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/browser/ui/iconLabel/iconLabel.ts#L20
    export interface IIconLabelValueOptions {
        title?: string;
        descriptionTitle?: string;
        hideIcon?: boolean;
        extraClasses?: string[];
        italic?: boolean;
        matches?: monaco.filters.IMatch[];
        labelEscapeNewLines?: boolean;
        descriptionMatches?: monaco.filters.IMatch[];
        readonly separator?: string;
        readonly domId?: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenModel.ts#L55
    export class QuickOpenEntry {
        constructor(highlights?: IHighlight[]);
        getLabel(): string | undefined;
        getLabelOptions(): IIconLabelValueOptions | undefined;
        getAriaLabel(): string;
        getDetail(): string | undefined;
        getIcon(): string | undefined;
        getDescription(): string | undefined;
        getKeybinding(): monaco.keybindings.ResolvedKeybinding | undefined;
        getResource(): Uri | undefined;
        isHidden(): boolean;
        setHidden(hidden: boolean): void;
        setHighlights(labelHighlights?: IHighlight[], descriptionHighlights?: IHighlight[], detailHighlights?: IHighlight[]): void;
        getHighlights(): [IHighlight[] | undefined /* Label */, IHighlight[] | undefined /* Description */, IHighlight[] | undefined /* Detail */];
        run(mode: Mode, context: IEntryRunContext): boolean;
    }

    export function compareEntries(elementA: QuickOpenEntry, elementB: QuickOpenEntry, lookFor: string): number;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenModel.ts#L197
    export class QuickOpenEntryGroup extends QuickOpenEntry {
        constructor(entry?: QuickOpenEntry, groupLabel?: string, withBorder?: boolean);
        getGroupLabel(): string | undefined;
        setGroupLabel(groupLabel: string): void;
        showBorder(): boolean;
        setShowBorder(showBorder: boolean): void;
        getEntry(): QuickOpenEntry | undefined;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/tree/browser/tree.ts#L571
    export interface IActionProvider {
        hasActions(element: any, item: any): boolean;
        getActions(element: any, item: any): ReadonlyArray<monaco.editor.IAction> | null;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/parts/quickopen/browser/quickOpenModel.ts#L489
    export class QuickOpenModel implements IModel<QuickOpenEntry>, IDataSource<QuickOpenEntry>, IFilter<QuickOpenEntry>, IRunner<QuickOpenEntry>,
        IAccessiblityProvider<QuickOpenEntry> {
        constructor(entries?: QuickOpenEntry[], actionProvider?: IActionProvider);
        addEntries(entries: QuickOpenEntry[]): void;
        entries: QuickOpenEntry[];
        dataSource: IDataSource<QuickOpenEntry>;
        renderer: IRenderer<QuickOpenEntry>;
        runner: IRunner<QuickOpenEntry>;
        filter?: IFilter<QuickOpenEntry>;
        accessibilityProvider?: IAccessiblityProvider<QuickOpenEntry>;
        getId(entry: QuickOpenEntry): string;
        getLabel(entry: QuickOpenEntry): string | null;
        isVisible(entry: QuickOpenEntry): boolean;
        run(entry: QuickOpenEntry, mode: Mode, context: IEntryRunContext): boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/quickOpen/editorQuickOpen.ts#L19
    export interface IQuickOpenControllerOpts {
        readonly inputAriaLabel: string;
        getModel(lookFor: string): QuickOpenModel;
        getAutoFocus(lookFor: string): IAutoFocus;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/quickOpen/editorQuickOpen.ts#L25
    export interface QuickOpenController extends IDisposable {
        static readonly ID: string;
        run(opts: IQuickOpenControllerOpts): void;

        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/quickOpen/editorQuickOpen.ts#L168-L169
        decorateLine(range: Range, editor: monaco.editor.ICodeEditor): void;
        clearDecorations(): void;
    }
}

declare module monaco.filters {
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/filters.ts#L15
    export interface IMatch {
        start: number;
        end: number;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/filters.ts#L337
    export function matchesFuzzy(word: string, wordToMatchAgainst: string, enableSeparateSubstringMatching?: boolean): IMatch[] | undefined;
}

declare module monaco.editorExtensions {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/editorExtensions.ts#L205
    export interface EditorAction {
        id: string;
        label: string;
        alias: string;
    }

    export module EditorExtensionsRegistry {
        // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/browser/editorExtensions.ts#L341
        export function getEditorActions(): EditorAction[];
    }
}
declare module monaco.modes {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L201
    export interface ITokenizationSupport {
        tokenize(line: string, state: monaco.languages.IState, offsetDelta: number): any;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L1613
    export interface TokenizationRegistry {
        get(language: string): ITokenizationSupport | null;
        getColorMap(): monaco.color.Color[] | null;
        readonly onDidChange: monaco.IEvent<any>;
    }
    export const TokenizationRegistry: TokenizationRegistry;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L140
    export class TokenMetadata {

        public static getLanguageId(metadata: number): number;

        public static getFontStyle(metadata: number): number;

        public static getForeground(metadata: number): number;

        public static getBackground(metadata: number): number;

        public static getClassNameFromMetadata(metadata: number): string;

        public static getInlineStyleFromMetadata(metadata: number, colorMap: string[]): string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/glob.ts#L18
    export interface IRelativePattern {
        base: string;
        pattern: string;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes/languageSelector.ts#L9
    export interface LanguageFilter {
        language?: string;
        scheme?: string;
        pattern?: string | IRelativePattern;
        /**
         * This provider is implemented in the UI thread.
         */
        hasAccessToAllModels?: boolean;
        exclusive?: boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes/languageSelector.ts#L20
    export type LanguageSelector = string | LanguageFilter | Array<string | LanguageFilter>;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes/languageFeatureRegistry.ts#L29
    export interface LanguageFeatureRegistry<T> {
        has(model: monaco.editor.ITextModel): boolean;
        all(model: monaco.editor.ITextModel): T[];
        register(selector: LanguageSelector, provider: T): IDisposable;
        readonly onDidChange: monaco.IEvent<number>;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L1525
    export const DocumentSymbolProviderRegistry: LanguageFeatureRegistry<monaco.languages.DocumentSymbolProvider>;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L1510
    export const CompletionProviderRegistry: LanguageFeatureRegistry<monaco.languages.CompletionItemProvider>;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/common/modes.ts#L1560
    export const CodeActionProviderRegistry: LanguageFeatureRegistry<monaco.languages.CodeActionProvider & { providedCodeActionKinds?: string[] }>;
}

declare module monaco.suggest {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/suggest/suggest.ts#L106
    export const enum SnippetSortOrder {
        Top, Inline, Bottom
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/suggest/suggest.ts#L28
    export interface CompletionItem {
        completion: monaco.languages.CompletionItem;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/suggest/suggest.ts#L110
    export class CompletionOptions {

        constructor(
            snippetSortOrder?: SnippetSortOrder,
            kindFilter?: Set<languages.CompletionItemKind>,
            providerFilter?: Set<languages.CompletionItemProvider>,
        );

    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/suggest/suggest.ts#L133
    export function provideSuggestionItems(
        model: monaco.editor.ITextModel,
        position: Position,
        options?: CompletionOptions,
        context?: monaco.languages.CompletionContext,
        token?: monaco.CancellationToken
    ): Promise<CompletionItem[]>;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/suggest/suggest.ts#L127
    export function setSnippetSuggestSupport(support: monaco.languages.CompletionItemProvider): monaco.languages.CompletionItemProvider;

}

declare module monaco.snippetParser {
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/contrib/snippet/snippetParser.ts#L583
    export class SnippetParser {
        parse(value: string): TextmateSnippet;
    }
    export class TextmateSnippet {
    }
}

declare module monaco.contextKeyService {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/contextkey/common/contextkey.ts#L805
    export interface IContextKey<T> {
        set(value: T): void;
        reset(): void;
        get(): T | undefined;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/contextkey/common/contextkey.ts#L829
    export interface IContextKeyService {
        // vs code has another object as argument https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/contextkey/common/contextkey.ts#L811
        // which contains restcicted number of HTMLElement methods
        createScoped(target?: HTMLElement): IContextKeyService;
        getContext(target?: HTMLElement): IContext;
        createKey<T>(key: string, defaultValue: T | undefined): IContextKey<T>;
        contextMatchesRules(rules: monaco.contextkey.ContextKeyExpr | undefined): boolean;
        onDidChangeContext: monaco.IEvent<IContextKeyChangeEvent>;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/contextkey/common/contextkey.ts#L801
    export interface IContext {
        getValue<T>(key: string): T | undefined;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/contextkey/common/contextkey.ts#L825
    export interface IContextKeyChangeEvent {
        affectsSome(keys: Set<string>): boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/contextkey/browser/contextKeyService.ts#L321
    export class ContextKeyService implements IContextKeyService {
        constructor(configurationService: monaco.services.IConfigurationService);
        createScoped(target?: HTMLElement): IContextKeyService;
        getContext(target?: HTMLElement): IContext;
        createKey<T>(key: string, defaultValue: T | undefined): IContextKey<T>;
        contextMatchesRules(rules: monaco.contextkey.ContextKeyExpr | undefined): boolean;
        onDidChangeContext: monaco.IEvent<IContextKeyChangeEvent>;
    }
}

declare module monaco.contextkey {
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/platform/contextkey/common/contextkey.ts#L29
    export class ContextKeyExpr {
        keys(): string[];
        static deserialize(when: string): ContextKeyExpr;
        serialize(): string;
    }
}

declare module monaco.mime {

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/mime.ts#L18
    export interface ITextMimeAssociation {
        readonly id: string;
        readonly mime: string;
        readonly filename?: string;
        readonly extension?: string;
        readonly filepattern?: string;
        readonly firstline?: RegExp;
        readonly userConfigured?: boolean;
    }

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/mime.ts#L42
    export function registerTextMime(association: monaco.mime.ITextMimeAssociation, warnOnOverwrite: boolean): void;

    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/mime.ts#L98
    export function clearTextMimes(onlyUserConfigured?: boolean): void;
}

declare module monaco.error {
    // https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/base/common/errors.ts#L77
    export function onUnexpectedError(e: any): undefined;
}

/**
 * overloading languages register functions to accept LanguageSelector,
 * check that all register functions passing a selector to registries:
 * https://github.com/theia-ide/vscode/blob/standalone/0.19.x/src/vs/editor/standalone/browser/standaloneLanguages.ts#L338-L495
 */
declare module monaco.languages {
    export function registerReferenceProvider(selector: monaco.modes.LanguageSelector, provider: ReferenceProvider): IDisposable;
    export function registerRenameProvider(selector: monaco.modes.LanguageSelector, provider: RenameProvider): IDisposable;
    export function registerSignatureHelpProvider(selector: monaco.modes.LanguageSelector, provider: SignatureHelpProvider): IDisposable;
    export function registerHoverProvider(selector: monaco.modes.LanguageSelector, provider: HoverProvider): IDisposable;
    export function registerDocumentSymbolProvider(selector: monaco.modes.LanguageSelector, provider: DocumentSymbolProvider): IDisposable;
    export function registerDocumentHighlightProvider(selector: monaco.modes.LanguageSelector, provider: DocumentHighlightProvider): IDisposable;
    export function registerDefinitionProvider(selector: monaco.modes.LanguageSelector, provider: DefinitionProvider): IDisposable;
    export function registerImplementationProvider(selector: monaco.modes.LanguageSelector, provider: ImplementationProvider): IDisposable;
    export function registerTypeDefinitionProvider(selector: monaco.modes.LanguageSelector, provider: TypeDefinitionProvider): IDisposable;
    export function registerCodeLensProvider(selector: monaco.modes.LanguageSelector, provider: CodeLensProvider): IDisposable;
    export function registerCodeActionProvider(selector: monaco.modes.LanguageSelector, provider: CodeActionProvider): IDisposable;
    export function registerDocumentFormattingEditProvider(selector: monaco.modes.LanguageSelector, provider: DocumentFormattingEditProvider): IDisposable;
    export function registerDocumentRangeFormattingEditProvider(selector: monaco.modes.LanguageSelector, provider: DocumentRangeFormattingEditProvider): IDisposable;
    export function registerOnTypeFormattingEditProvider(selector: monaco.modes.LanguageSelector, provider: OnTypeFormattingEditProvider): IDisposable;
    export function registerLinkProvider(selector: monaco.modes.LanguageSelector, provider: LinkProvider): IDisposable;
    export function registerCompletionItemProvider(selector: monaco.modes.LanguageSelector, provider: CompletionItemProvider): IDisposable;
    export function registerColorProvider(selector: monaco.modes.LanguageSelector, provider: DocumentColorProvider): IDisposable;
    export function registerFoldingRangeProvider(selector: monaco.modes.LanguageSelector, provider: FoldingRangeProvider): IDisposable;
    export function registerDeclarationProvider(selector: monaco.modes.LanguageSelector, provider: DeclarationProvider): IDisposable;
    export function registerSelectionRangeProvider(selector: monaco.modes.LanguageSelector, provider: SelectionRangeProvider): IDisposable;
}
