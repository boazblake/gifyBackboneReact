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
   				<input type='search' placeholder='search your gif'/>
    			<Header/>
    			<Gallery gifs={this.props.gifs} />
    		</div>
    		)
    	}
    })


    var Header = React.createClass({
    	render: function() {

    		return (
    			<div className='heading'>
    				<button onClick={GifyView} className='home'>HOME</button>
    				<h1 className='gifTitle'>Your Gifs</h1>
    				<h3 className='subTitle'>All your gifs in one place! </h3>
    			</div>
    		)
    	}
    })

    var Gallery = React.createClass({

    	_getGifsJSX:function(gifsArray){
    		var gifsJSXArray = []
    		gifsArray.forEach(function(gifObject){
    			var component = <Gifys key={gifObject.id} gifs={gifObject}/>
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

	    _hashChange:function(imagePress){
            this
	    	window.location.hash = ('detailView/'+ imagePress.target.dataset['id'])
	    },


    	render:function(){

    		var gifs = this.props.gifs
    		return (
    			<div>
    				<img onClick={this._hashChange} src={gifs.get('images').original.url} data-id={gifs.get('id')}/>
    			</div>
    			)
    	},
    })

    var DetailView = React.createClass({

    	componentWillMount: function(){
    		var self = this
    	// 	// console.log('/////this is in will mount/////')
    		console.log(self)
    		console.log('======this is in mount =======')

    		this.props.gifs.on('sync', function() {self.forceUpdate()})
    	},

        _dataPendingJSX: function(mdl){

            if ( mdl.get('images') ) {
                console.log(mdl.attributes)
                return ( 
                    <div>            
                        <h1>{mdl.get('slug')}</h1>
                        <img src={mdl.get('images').original.url}/ >
                    </div>
                )

            } else {
                return <p> Loading....</p>
            }

        },

    	render:function(){
    		var gif = this.props.gifs
    		// console.log('/////this is in render/////')
    		// console.log(window.location.hash.substr(1).split('/')[1])

    		console.log('======this is in render =======')

            

    		return(
    			<div className='gifDetailContainer'>
    			    <input type='search' placeholder='search your gif'/>
    				<button className='home'>HOME</button>
    				{ this._dataPendingJSX(gif) }
    			</div>
    			)
    	},
    })


    var GifyCollection = Backbone.Collection.extend({
    	url:'http://api.giphy.com/v1/gifs/search?q=husky',
    	api_key:'dc6zaTOxFJmzC',

    	parse:function(rawJSON){
    		return rawJSON.data
    	}
    })

    var GifyModel = Backbone.Model.extend({
    	url: 'http://api.giphy.com/v1/gifs/',

        _setURL: function(id){
            this.url = 'http://api.giphy.com/v1/gifs/' + id
        },

    	api_key:'dc6zaTOxFJmzC',
    	
    	parse:function(rawJSON){
    		// console.log('this is in parse')
    		// console.log(rawJSON)
    		return rawJSON.data
    	}
    })

	var GifyRouter = Backbone.Router.extend({
		routes:{
			"detailView/:id":"_detailView",
			// "gallery/:query": "_galleryView",
			"*home":"_galleryView"
		},

		_detailView: function(id) {
            console.log("unmounting")
            // if (this.coll){ this.coll=null }
            this.model._setURL(id)

            console.log(this.model.url)
			this.model.fetch({
				data: {
					api_key:this.model.api_key
				}
			})

            DOM.unmountComponentAtNode(document.querySelector('.container'));

			DOM.render(<DetailView gifs={this.model}/>, document.querySelector('.container'))

		},

		_galleryView: function(query) {
			this.coll.fetch({
				data: {
					q: query,
					api_key: this.coll.api_key
				}
			})
            DOM.unmountComponentAtNode( document.querySelector('.container') );
			DOM.render(<GifyView gifs={this.coll}/>, document.querySelector('.container'))
		},

		initialize: function(){
			this.coll = new GifyCollection()
			this.model = new GifyModel()
			Backbone.history.start()
		}
	})

	var rtr = new GifyRouter()
}
app()
