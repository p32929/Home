import { state, action, createStore } from 'usm-redux';
import { compose } from 'redux';
import { IData, IUrlButton } from '@/lib/Models';
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
    data: IData,
    // 
    isAddDialogOpen: boolean,
    isImportDialogOpen: boolean,
    editingUrlIndex: number,
    exportText: string,
}

async function onDataChange(data: IData) {
    localStorage.setItem(Constants.STORAGE, JSON.stringify(data))
}

export class Controller {
    @state
    states: IStates = {
        data: {
            urls: [],
            sortOption: "Creation"
        },
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

        onDataChange(this.states.data)
    }

    @action
    setData(data: Partial<IData>) {
        this.states.data = {
            ...this.states.data,
            ...data,
        }

        onDataChange(this.states.data)
    }

    @action
    addUrl(url: IUrlButton) {
        this.states.data.urls.push(url)
        this.states.isAddDialogOpen = false
        this.states.editingUrlIndex = -1

        onDataChange(this.states.data)
    }

    @action
    editUrl(url: IUrlButton) {
        this.states.data.urls[this.states.editingUrlIndex] = url
        this.states.isAddDialogOpen = false
        this.states.editingUrlIndex = -1

        localStorage.setItem(Constants.STORAGE, JSON.stringify(this.states.data))
    }

    @action
    deleteUrl(index: number) {
        this.states.data.urls.splice(index, 1)

        onDataChange(this.states.data)
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