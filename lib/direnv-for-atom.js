'use babel';

import {
    CompositeDisposable
} from 'atom';
import {
    default as efh
} from './env_file_handler.js';
import {
    default as msg
} from './message_builder.js';

export default {

    direnvFile: null,
    fileDir: null,
    subscriptions: null,
    eVMap: null,


    activate(state) {
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();

        atom.workspace.observeActiveTextEditor(editor => {
            if (atom.workspace.getActiveTextEditor()) {
                this.reload()
            }
        });
        msg.pollMsgDisable();

        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'direnv-for-atom:reload-envs': () => this.reload(),
            'direnv-for-atom:unload-envs': () => this.unload()
        }));
    },

    deactivate() {
        this.unload();
        delete this.eVMap;
        this.subscriptions.dispose();
    },

    reload() {
        msg.pollMsgDisable();
        const currentDir = atom.workspace.getActiveTextEditor().getDirectoryPath();
        if (currentDir != this.fileDir) {
            if (this.eVMap && this.eVMap.size > 0) {
                this.unload();
            } else {
                this.eVMap = new Map();
            }
            this.fileDir = currentDir;
            this.direnvFile = atom.config.get("direnv-for-atom.envFilePathOverride");
            if (this.direnvFile == "") {
                this.direnvFile = null;
                this.direnvFile = efh.backwardsEnvFileFind(this.fileDir);
            }
            if (this.direnvFile) {
                this.getEnvs();
            } else {
                msg.noEnvFileWarning();
            }
        }
    },

    unload() {
        for (let [key, val] of this.eVMap) {
            delete process.env[key];
        }
        console.log(this.eVMap);
        msg.unloadSuccessful(this.eVMap);
        this.eVMap = null;
    },

    getEnvs() {
        const fileFormat = atom.config.get('direnv-for-atom.envFileFormat');
        if (fileFormat == 'direnv') {
            this.eVMap = efh.extractDirEnv(this.direnvFile);
        } else {
            this.eVMap = efh.extractJSON(this.direnvFile);
        }
    },


};
