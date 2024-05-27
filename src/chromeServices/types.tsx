export enum MessageTypes {
    GET_CONTENT = "get_content",
    HIGHLIGHT = "highlight"
}

export interface ActionType {
    param?: any;
    type: MessageTypes;
    payload?: { [index: string]: any };
    response?: any;
}

export interface GetPageContent extends ActionType {
    type: MessageTypes.GET_CONTENT;
    response: any[];
}

export interface HighLightContent extends ActionType {
    type: MessageTypes.HIGHLIGHT;
}
