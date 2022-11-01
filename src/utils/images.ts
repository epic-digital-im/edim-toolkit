export const resizedataURL = (base64: string, max: number, quality: number) => {
    return new Promise(async function (resolve, reject) {

        const img = document.createElement('img');

        img.onload = function () {
            try {
                const width = img.width;
                const height = img.height;
                const isLandScape = width > height;
                let targetWidth = isLandScape ? max : Math.round((width * max) / height);
                let targetHeight = isLandScape ? Math.round((height * max) / width) : max;

                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = targetWidth;
                canvas.height = targetHeight;

                ctx?.drawImage(this, 0, 0, targetWidth, targetHeight);
                const dataURI = canvas.toDataURL('image/jpeg', quality || 0.7);
                resolve(dataURI);
            } catch (err) {
                reject(err);
            }
        };
        img.src = base64;
    });
};