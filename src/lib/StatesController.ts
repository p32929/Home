import { state, action, createStore } from 'usm-redux';
import { compose } from 'redux';
import { IUrlButton } from '@/lib/Models';
import { Constants } from '@/lib/Constants';

const composeEnhancers =
    // @ts-ignore
    typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? // @ts-ignore
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsDenylist, actionsCreators, serialize...
        })
        : compose;

export interface IStates {
    urls: IUrlButton[],
    // 
    isAddDialogOpen: boolean,
    isImportDialogOpen: boolean,
    editingUrlIndex: number,
    exportText: string,
}

export class Controller {
    @state
    states: IStates = {
        urls: [],
        // 
        isAddDialogOpen: false,
        isImportDialogOpen: false,
        editingUrlIndex: -1,
        exportText: "",
    }

    @action
    setState(state: Partial<IStates>) {
        this.states = {
            ...this.states,
            ...state,
        }

        localStorage.setItem(Constants.STORAGE, JSON.stringify(this.states.urls))
    }

    @action
    addUrl(url: IUrlButton) {
        this.states.urls.push(url)
        this.states.isAddDialogOpen = false
        this.states.editingUrlIndex = -1

        localStorage.setItem(Constants.STORAGE, JSON.stringify(this.states.urls))
    }

    @action
    editUrl(url: IUrlButton) {
        this.states.urls[this.states.editingUrlIndex] = url
        this.states.isAddDialogOpen = false
        this.states.editingUrlIndex = -1

        localStorage.setItem(Constants.STORAGE, JSON.stringify(this.states.urls))
    }

    @action
    deleteUrl(index: number) {
        this.states.urls.splice(index, 1)

        localStorage.setItem(Constants.STORAGE, JSON.stringify(this.states.urls))
    }
}

export const controller = new Controller();

export const store = createStore(
    {
        modules: [controller],
    },
    undefined,
    {
        reduxEnhancer: composeEnhancers(),
    }
);