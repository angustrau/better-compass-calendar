declare module 'web-push' {
    interface PushSubscription {
        endpoint: string;
        keys: {
            p256dh: string,
            auth: string
        }
    }

    interface PushOptions {
        gcmAPIKey?: string;
        vapidDetails?: VAPIDKeys;
        TTL?: number;
        headers?: Headers;
        contentEncoding?: string;
        proxy?: string
    }

    interface PushResult {
        statusCode: number;
        headers: Headers;
        body: Buffer;
    }

    interface VAPIDKeys {
        subject: string,
        publicKey: string,
        privateKey: string
    }

    interface EncryptionDetails {
        localPublicKey: string;
        salt: string;
        cipherText: Buffer;
    }

    interface RequestDetails {
        endpoint: string;
        method: string;
        headers: Headers;
        body: Buffer;
    }

    interface Headers {
        [headerName: string]: string;
    }

    interface WebPush {
        setVapidDetails: (contact: string, publicKey: string, privateKey: string) => void;
        sendNotification: (subscription: PushSubscription, payload?: string, options?: PushOptions) => Promise<PushResult>;
        generateVAPIDKeys: () => VAPIDKeys;
        setGCMAPIKey: (apiKey: string) => void;
        encrypt: (userPublicKey: string, userAuth: string, payload: string, contentEncoding: string) => Promise<EncryptionDetails>;
        getVapidHeaders: (audience: string, subject: string, publicKey: string, privateKey: string, contentEncoding: string, expiration?: number) => EncryptionDetails;
        generateRequestDetails: (pushSubscription: PushSubscription, payload?: string, options?: PushOptions) => RequestDetails;
    }
    
    const webpush: WebPush;
    export = webpush;
}