'use babel';

import { CompositeDisposable } from 'atom';

export default {

  direnvFileDir: null,
  fileDir: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    atom.workspace.observeActiveTextEditor(editor => {
        if (atom.workspace.getActiveTextEditor()) {
          this.reload()
        }
    })

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'direnv-for-atom:reload-envs': () => this.reload()
    }));
  },

  deactivate() {
      this.subscriptions.dispose();
  },

  reload() {
    const currentDir = atom.workspace.getActiveTextEditor().getDirectoryPath();
    if (currentDir != this.fileDir) {
        this.fileDir = currentDir;
        this.direnvFileDir = currentDir;
        this.backwardsEnvFind();
    }
  },

  backwardsEnvFind() {
    var pathPcs = this.fileDir.split('/').slice(1);
    const pathOvrd = atom.config.get('direnv-for-atom.envFileOverride');
    const maxLvl = atom.config.get('direnv-for-atom.maxLevelBack');
    for (let i = 0; i < 3; i++) {
      var pathChk = '/' + pathPcs.join('/');
      atom.notifications.addInfo(pathChk);
    }


  },

  getEnvs() {

  },

  buildMessage() {

  }

};
