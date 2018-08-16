/**
 * Document: https://docs.qingcloud.com/qingstor/sdk/js/index.html
 */

module.exports = { uploadObject };

function init(env) {
    let QingStor = require('qingstor-sdk').QingStor;
    let Config = require('qingstor-sdk').Config;
    let userConfig = new Config().loadDefaultConfig();
    userConfig.access_key_id = env.access_id;
    userConfig.secret_access_key = env.access_key;

    return new QingStor(userConfig);
}

/**
 * 上传文件到指定Bucket
 * @param env
 * @param path
 * @param uploadFile
 * @param fileType
 */
function uploadObject(env, path, uploadFile, fileType) {
    let service = init(env);
    let bucket = service.Bucket(env.bucket_name, env.location);

    return new Promise((resolve, reject) => {
        bucket.putObject(
            path,
            {
                'body': require('fs').readFileSync(uploadFile),
                'Content-Type': fileType
            },
            (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            }
        );
    });
};