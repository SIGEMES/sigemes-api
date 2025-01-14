import { WebServer } from "./config/web";

export async function main(): Promise<void> {
    const webServer: WebServer = new WebServer(3000);
    webServer.start();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });