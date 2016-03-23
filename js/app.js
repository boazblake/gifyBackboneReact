// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'backbone'

function app() {
    // start app
    // new Router()
    // DOM.render(<p>Boaz</p>, document.querySelector('.container'))

    var GifyView = React.createClass({

    	componentWillMount: function(){
    		var self = this
    		this.props.gifs.on('sync', function() {self.forceUpdate()})
    	},

    	render:function(){

    	return (
    		<div className='gifsContainer'>
    			<Header/>
    			<Scroll gifs={this.props.gifs} />
    		</div>
    		)
    	}
    })


    var Header = React.createClass({
    	render: function() {

    		return (
    			<div className='heading'>
    				<h1 className='gifTitle'>Your Gifs</h1>
    				<h3 className='subTitle'>All your gifs in one place! </h3>
    			</div>
    		)
    	}
    })

    var Scroll = React.createClass({

    	_getGifsJSX:function(gifsArray){
    		var gifsJSXArray = []
    		gifsArray.forEach(function(gifObject){
    			var component = <Gifys key={gifObject.id} gifs={gifObject} />
    			gifsJSXArray.push(component)
    		})
    		return gifsJSXArray
    	},

    	render: function(){
    		return (
    			<div>
    				{this._getGifsJSX(this.props.gifs.models)}
    			</div>
    			)
    	}
    })


    var Gifys = React.createClass({

    	render:function(){
    		var gifs = this.props.gifs
    		console.log(gifs.get('images').original.url)
    		return (
    			<div>
    				<img src={gifs.get('images').original.url}/>
    			</div>
    			)
    	}
    })

    var GifyCollection = Backbone.Collection.extend({
    	url:'http://api.giphy.com/v1/gifs/search?q=husky',
    	api_key:'dc6zaTOxFJmzC',

    	parse:function(rawJSON){
    		return rawJSON.data
    	}
    })


	var GifyRouter = Backbone.Router.extend({
		routes:{
			"detailView/:query":"_detailView",
			"gallery/:query": "_galleryView",
			"*home":"_galleryView"
		},

		_galleryView: function(query) {

			var coll = new GifyCollection()
			coll.fetch({
				data: {
					q: query,
					api_key: coll.api_key
				}
			})
			DOM.render(<GifyView gifs={coll}/>, document.querySelector('.container'))
		},

		initialize: function(){
			Backbone.history.start()
		}
	})

	var rtr = new GifyRouter()
}
app()
