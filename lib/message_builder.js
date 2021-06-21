'use babel';


export default {

    info_disable: null,
    success_disable: null,
    warning_disable: null,
    error_disable: null,

    pollMsgDisable() {
        this.info_disable = atom.config.get('direnv-for-atom.disable_info_msgs');
        this.success_disable = atom.config.get('direnv-for-atom.disable_success_msgs');
        this.warning_disable = atom.config.get('direnv-for-atom.disable_warning_msgs');
        this.error_disable = atom.config.get('direnv-for-atom.disable_error_msgs');
    },

    noEnvFileWarning() {
        if (this.warning_disable) { return null; }
        atom.notifications.addWarning('No environment variable file found.');
    },

    unloadSuccessful(unloadedVars) {
        console.log('UnloadedVars - ' + unloadedVars);
        if (this.success_disable) { return null; }
        var msg = 'Env Vars Unloaded';
        var detail = 'The following Environment Variables were unloaded:';
        var description = '<table>';
        for (let [x,y] of unloadedVars) {
            description = description + '<td><td><center>' + x + '</td><td>' + y + '</td></tr>';
        }
        description = description + '</table>';
        atom.notifications.addSuccess(msg, {
            'description': description,
            'detail': detail
        });

    },

};
