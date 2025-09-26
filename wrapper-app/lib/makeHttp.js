class MakeHttp {
    RequestLib;

    constructor(requestLibrary) {
        this.RequestLib = requestLibrary
    }

    makeRequest(options, cbFn) {
        this.RequestLib.makeRequestFn(options, cbFn);
    }
    makeAxios(options, cbFn) {
        this.RequestLib.makeAxiosFn(options, cbFn);
    }
    makePromisifiedAxios(options, cbFn) {
        return this.RequestLib.makePromisifiedAxiosFn(options, cbFn);
    }

}