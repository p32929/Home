import axios from 'axios';

export class Server {
    static async getDominantColors(imgUrl: string): Promise<{
        response: any,
        error: any,
    }> {
        let data = JSON.stringify({
            "url": imgUrl,
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://51.20.98.150:9999/image-colors',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        return new Promise((resolve) => {
            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    resolve({
                        error: null,
                        response: response,
                    })
                })
                .catch((error) => {
                    console.log(error);
                    resolve({
                        error: error,
                        response: null,
                    })
                });
        })
    }
}
