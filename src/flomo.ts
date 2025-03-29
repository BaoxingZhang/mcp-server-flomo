/**
 * 用于与Flomo API交互的客户端。
 */
export class FlomoClient {
    private readonly apiUrl: string;

    /**
       * 创建一个新的Flomo客户端。
       * @param apiUrl - Flomo API的URL地址。
       */
    constructor({ apiUrl }: { apiUrl: string }) {
        this.apiUrl = apiUrl;
    }

    /**
       * 向Flomo写入一条笔记。
       * @param content - 笔记的内容。
       * @returns Flomo API的响应。
       */
    async writeNote({ content }: { content: string }) {
        try {
            if (!content) {
                throw new Error("invalid content");
            }

            const req = {
                content,
            };

            const resp = await fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(req),
            });

            if (!resp.ok) {
                throw new Error(`request failed with status ${resp.statusText}`);
            }

            return resp.json();
        } catch (e) {
            throw e;
        }
    }
}