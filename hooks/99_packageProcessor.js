const fs = require('fs-extra');
const tmp = require('tmp');

module.exports = {
    /**
     * Move directory with source code to specified.
     *
     * @param generator
     */
    'generate:after': generator => {
        const sourcePath = generator.targetDir + '/src/main/java/';
        let javaPackage = generator.templateParams['userJavaPackage'];

        javaPackage = javaPackage.replace(/\./g, '/');

        if (javaPackage !== 'com/asyncapi') {
            const tmpSrc = tmp.dirSync();
            const tmpTest = tmp.dirSync();
            fs.copySync(sourcePath + 'com/asyncapi', tmpSrc.name);
            fs.removeSync(sourcePath + 'com');
            fs.copySync(tmpSrc.name, sourcePath + javaPackage);
            tmp.setGracefulCleanup();
        }
    },

    /**
     * If parameters wasn't pass, but extension is used, then set extension to param value.
     * Since template params are not modifiable, another param used to store updated value.
     *
     * @param generator
     */
    'generate:before': generator => {
        const extensions = generator.asyncapi.info().extensions();
        let javaPackage = generator.templateParams['javaPackage'];

        if (javaPackage === 'com.asyncapi' && extensions && extensions['x-java-package']) {
            javaPackage = extensions['x-java-package'];
        }

        Object.defineProperty(generator.templateParams, 'userJavaPackage', {
            enumerable: true,
            get() {
                return javaPackage;
            }
        });
    }
};