import React from 'react';
import {render, hydrate} from 'react-dom';
import {setStylesTarget} from "typestyle";

import {Provider} from 'reactivated/context';
import axios from 'axios';

const props = (window as any).__PRELOADED_PROPS__;
const context = (window as any).__PRELOADED_CONTEXT__;

if ((module as any).hot) {
    (module as any).hot.accept()
}

const Template = require('client/templates/' + context.template_name + '.tsx').default;

setStylesTarget(document.getElementById('styles-target')!);

hydrate(<Provider value={context}><Template {...props} /></Provider>, document.getElementById('root'));
