'use babel';

import DirenvForAtomView from './direnv-for-atom-view';
import { CompositeDisposable } from 'atom';

export default {

  direnvForAtomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.direnvForAtomView = new DirenvForAtomView(state.direnvForAtomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.direnvForAtomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'direnv-for-atom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.direnvForAtomView.destroy();
  },

  serialize() {
    return {
      direnvForAtomViewState: this.direnvForAtomView.serialize()
    };
  },

  toggle() {
    console.log('DirenvForAtom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
