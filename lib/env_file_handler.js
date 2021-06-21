'use babel';

import {
    File
} from 'atom';

export default {

    backwardsEnvFileFind(fileDir) {
        var pathPcs = fileDir.split('/').slice(1);
        const fileNameOvrd = atom.config.get('direnv-for-atom.envFileNameOverride');
        for (let i = pathPcs.length; i >= 2; i--) {
            var fileChk = '/' + pathPcs.join('/') + '/' + fileNameOvrd;
            var envFile = new File(fileChk).existsSync();
            if (envFile) {
                console.log('hit')
                return fileChk;
            }
            pathPcs.pop();
        }
        return null;
    },

    extractJSON() {

    },

    extractDirEnv(direnvFile) {
        var fileContents = new File(direnvFile).readSync();
        var fcList = fileContents.split('\n').slice(0, 2);
        const re = /\=| /
        var eVMap = new Map();
        fcList.forEach(
            (e) => {
                var eLst = e.split(re).slice(1);
                eVMap.set(...eLst);
                console.log(eLst[0]);
                process.env[eLst[0]] = eLst[1];
            }
        );
        return eVMap;
    },
}
