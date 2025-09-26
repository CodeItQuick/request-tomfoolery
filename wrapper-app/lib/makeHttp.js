export class MakeHttp {
    RequestLib;

    constructor(requestLibrary) {
        this.RequestLib = requestLibrary
    }

    makeRequest(options, cbFn) {
        this.RequestLib(options, cbFn);
    }
    makeAxios(options, cbFn) {
        this.RequestLib(options, cbFn);
    }
    makePromisifiedAxios(options, cbFn) {
        return this.RequestLib(options, cbFn);
    }

}