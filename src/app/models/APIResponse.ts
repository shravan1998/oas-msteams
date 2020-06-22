export class APIResponse {
    private _status: number;
    private _description: string;
    private _data: Object;


    /**
     * Getter status
     * @return {number}
     */
    public get status(): number {
        return this._status;
    }

    /**
     * Getter description
     * @return {string}
     */
    public get description(): string {
        return this._description;
    }

    /**
     * Getter data
     * @return {Object}
     */
    public get data(): Object {
        return this._data;
    }

    /**
     * Setter status
     * @param {number} value
     */
    public set status(value: number) {
        this._status = value;
    }

    /**
     * Setter description
     * @param {string} value
     */
    public set description(value: string) {
        this._description = value;
    }

    /**
     * Setter data
     * @param {Object} value
     */
    public set data(value: Object) {
        this._data = value;
    }
}