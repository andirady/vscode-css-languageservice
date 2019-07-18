/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';

import {
	ICSSDataProvider,
	IPropertyData,
	IAtDirectiveData,
	IPseudoClassData,
	IPseudoElementData,
} from '../cssLanguageTypes';
import * as objects from '../utils/objects';

export class CSSDataManager {
	private _propertySet: { [k: string]: IPropertyData } = {};
	private _atDirectiveSet: { [k: string]: IAtDirectiveData } = {};
	private _pseudoClassSet: { [k: string]: IPseudoClassData } = {};
	private _pseudoElementSet: { [k: string]: IPseudoElementData } = {};

	private _properties: IPropertyData[] = [];
	private _atDirectives: IAtDirectiveData[] = [];
	private _pseudoClasses: IPseudoClassData[] = [];
	private _pseudoElements: IPseudoElementData[] = [];

	constructor(private dataProviders: ICSSDataProvider[]) {
		this.collectData();
	}

	addDataProviders(providers: ICSSDataProvider[]) {
		this.dataProviders = this.dataProviders.concat(providers);
		this.collectData();
	}

	/**
	 * Collect all data  & handle duplicates
	 */
	private collectData() {
		this.dataProviders.forEach(provider => {
			provider.provideProperties().forEach(p => {
				if (!this._propertySet[p.name]) {
					this._propertySet[p.name] = p;
				}
			});
			provider.provideAtDirectives().forEach(p => {
				if (!this._atDirectiveSet[p.name]) {
					this._atDirectiveSet[p.name] = p;
				}
			});
			provider.providePseudoClasses().forEach(p => {
				if (!this._pseudoClassSet[p.name]) {
					this._pseudoClassSet[p.name] = p;
				}
			});
			provider.providePseudoElements().forEach(p => {
				if (!this._pseudoElementSet[p.name]) {
					this._pseudoElementSet[p.name] = p;
				}
			});
		});

		this._properties = objects.values(this._propertySet);
		this._atDirectives = objects.values(this._atDirectiveSet);
		this._pseudoClasses = objects.values(this._pseudoClassSet);
		this._pseudoElements = objects.values(this._pseudoElementSet);
	}

	getProperty(name: string) { return this._propertySet[name]; }
	getAtDirective(name: string) { return this._atDirectiveSet[name]; }
	getPseudoClass(name: string) { return this._pseudoClassSet[name]; }
	getPseudoElement(name: string) { return this._pseudoElementSet[name]; }

	getProperties() {
		return this._properties;
	}
	getAtDirectives() {
		return this._atDirectives;
	}
	getPseudoClasses() {
		return this._pseudoClasses;
	}
	getPseudoElements() {
		return this._pseudoElements;
	}

	isKnownProperty(name: string): boolean {
		return name.toLowerCase() in this._propertySet;
	}
	
	isStandardProperty(name: string): boolean {
		return this.isKnownProperty(name) &&
			(!this._propertySet[name.toLowerCase()].status || this._propertySet[name.toLowerCase()].status === 'standard');
	}
}