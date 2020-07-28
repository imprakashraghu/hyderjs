/**
 * hyderjs 0.0.1
 * (c) Hemaprakash Raghu, HyderJS
 * Contributors may be freely distributed under the MIT license.
 * https://hyderjs.tech
*/

let aggregation = (baseClass, ...mixins) => {
    class base extends baseClass {
        constructor (...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this,(new mixin));
            });
        }
    }
    let copyProps = (target, source) => {  
        Object.getOwnPropertyNames(source)
              .concat(Object.getOwnPropertySymbols(source))
              .forEach((prop) => {
                 if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
               })
    }
    mixins.forEach((mixin) => {
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });
    return base;
}
var state = {};
class HyderError {   

    _HyderError(msg) {
        document.querySelector('html').style.overflow = "hidden";
        let tag = document.createElement('div');
        tag.style.width = '100%';
        tag.style.height = '100%';        
        tag.style.position = "fixed";
        tag.style.top = 0;
        tag.style.left = 0;
        tag.style.right = 0;
        tag.style.zIndex = "20";        
        tag.style.backgroundColor = "rgba(0,0,98,1)"; 
        tag.style.padding = "2rem";
        let errors = msg.stack.split(' at ');
        for(let e in errors) {
            if(e===(errors.length-1).toString()){
                let txt = document.createElement('p');
                txt.append('at '+errors[e]);                
                txt.style.margin = "0.5rem";
                txt.style.paddingLeft = "2rem";
                txt.style.color = "white";                
                txt.style.fontSize = "1rem";
                tag.append(txt);
            } else if(e==="0") {
                let txt = document.createElement('p');
                txt.append(errors[e]);                
                txt.style.margin = "0.5rem";
                txt.style.color = "white";
                txt.style.fontWeight = 500;
                txt.style.fontSize = "1.2rem";
                tag.append(txt);
            }
        }
                
        this.parent.append(tag);
    }
}

class Spacing extends HyderError {
    constructor() {
        super();
    }
    _margin(content, element) {
      if(!content.className){
        if(content.margin && content.margin !== '') {
            if(typeof content.margin === 'number' || typeof content.margin === 'object') {
                if(typeof content.margin === 'number') {
                    let mad = parseInt(content.margin)*0.5;
                    element.style.margin = `${mad}rem`;
                } else if(typeof content.margin === 'object') {                    
                    if(content.margin.x !== '' && content.margin.x) {                        
                        let mad = parseInt(content.margin.x)*0.5;                        
                        element.style.marginRight = `${mad}rem`;
                        element.style.marginLeft = `${mad}rem`;                        
                    }
                    if(content.margin.y && content.margin.y !== '') {
                        let mad = parseInt(content.margin.y)*0.5;                        
                        element.style.marginTop = `${mad}rem`;
                        element.style.marginBottom = `${mad}rem`;   
                    }

                }
            } else this._HyderError(new TypeError(`Expected margin type number or object but got ${typeof content.margin}`));
        } 
      }
    }    

    _padding(content, element) {
        if(!content.className){
        if(content.padding && content.padding !== '') {
            if(typeof content.padding === 'number' || typeof content.padding === 'object') {
                if(typeof content.padding === 'number') {
                    let pad = parseInt(content.padding)*0.5;
                    element.style.padding = `${pad}rem`;
                } else if(typeof content.padding === 'object') {                    
                    if(content.padding.x !== '' && content.padding.x) {                        
                        let pad = parseInt(content.padding.x)*0.5;                        
                        element.style.paddingRight = `${pad}rem`;
                        element.style.paddingLeft = `${pad}rem`;                        
                    }
                    if(content.padding.y && content.padding.y !== '') {
                        let pad = parseInt(content.padding.y)*0.5;                        
                        element.style.paddingTop = `${pad}rem`;
                        element.style.paddingBottom = `${pad}rem`;   
                    }

                }
            } else this._HyderError(new TypeError(`Expected padding type number or object but got ${typeof content.padding}`));
        } else if(typeof content.padding === 'undefined'){
            // default styling            
            if(content.width === '') element.style.width = '100%';            
            element.style.paddingTop = element.style.paddingBottom = '0.5rem';
            element.style.paddingLeft = element.style.paddingRight = '1rem';
        }  
    }
    }
}

class StyleProps extends HyderError{
    constructor() {
        super();
    }
    _StyleProps(content, element) {            
                if(content.style) {                    
                        for(let style in content.style) {
                            if(!content[style]) {
                                element.style[style] = content.style[style];
                            } else this._HyderError(new Error("Component style already defined cannot duplicate styles"));
                        }                                                      
                        for(let style in content) {
                            if(style !== 'options'&& style!=='style') element[style] = content[style];
                        }
                } else {
                    for(let style in content) {
                        if(style !== 'options') element[style] = content[style];
                    }
                }            
            if(content.className && content.style) this._HyderError(new Error("Component cannot have custom classes and styles at once"));
    }
    
}

class Component extends aggregation(Spacing,StyleProps){       
    _defaultStyling(content, tag) {
        this._margin(content, tag);
        this._padding(content, tag);
        this._StyleProps(content, tag);        
    }
    _Heading(content) {        
        let tag = document.createElement(`h${content.level?content.level:'1'}`);
            tag.innerHTML = content.text;            
            this._defaultStyling(content, tag);
        return tag;
    }
    _Paragraph(content) {
        let tag = document.createElement('p');
            tag.innerHTML = content.text;            
            this._defaultStyling(content, tag);
        return tag;        
    }  
    _Anchor(content) {
        let tag = document.createElement('a');
            tag.innerHTML = content.text;            
            this._defaultStyling(content, tag);
        return tag;        
    }
    _Input(content) {
        let tag = document.createElement('input');
        let tag2 = document.createElement('label');
            // state check
            if(content.ref && content.ref !== '' && content.type !== 'checkbox') state[content.ref] = tag.value;   
            if(content.type === 'checkbox' && content.ref) state[content.ref] = tag.checked;

            tag.onchange = function() {
                if(content.type === 'checkbox') state[content.ref] = tag.checked;                
                else state[content.ref] = tag.value;
            }          

            if(content.label){                
                tag2.innerHTML = content.label;
                this._defaultStyling(content, tag2);
                tag2.append(tag);
            }            

            this._defaultStyling(content, tag); 
            // default styling
            tag.style.outline = "none";
            tag.style.border = "1px solid #e2e8f0";
            tag.style.padding = '0.7rem';
            tag.style.borderRadius = "4px";
            tag.style.fontStyle = "1.5rem";
            tag.style.margin = "1rem";       
        if(content.label)   {
            return tag2;
        } else {
            return tag;
        }
    }
    _Button(content) {
        let tag = document.createElement('button');
            tag.innerHTML = content.text;             
            this._defaultStyling(content, tag);           
            if(content.disabled && content.disabled !== '') {
                if(typeof content.disabled === 'boolean') {
                    tag.disabled = content.disabled;
                } else this._HyderError(new TypeError(`Expected margin type boolean but got ${typeof content.disabled}`));
            } 
            if(content.type !== '' && content.type) {    
                if(typeof content.type === 'string') {
                    tag.style.cursor = "pointer";
                    tag.style.paddingLeft = '1rem'; tag.style.paddingRight = '1rem';
                    tag.style.paddingBottom = '0.5rem'; tag.style.paddingTop = '0.5rem';                
                    if(content.type === 'simple') {                 
                        tag.style.border = "0px";                      
                        tag.style.backgroundColor = "#718096";
                        tag.style.color = "white";                   
                        tag.style.borderRadius = '4px';
                    } else if(content.type === 'negative') {        
                        tag.style.border = "0px";                               
                        tag.style.backgroundColor = "red";
                        tag.style.color = "white";                   
                        tag.style.borderRadius = '4px';
                    } else if(content.type === 'elegant') {                    
                        tag.style.border = "0px";                   
                        tag.style.backgroundColor = "#5a67d8";
                        tag.style.color = "white";                   
                        tag.style.borderRadius = '4px';
                    } else if(content.type === 'peace') { 
                        tag.style.border = "0px";                   
                        tag.style.backgroundColor = "#319795";
                        tag.style.color = "white";                  
                        tag.style.borderRadius = '4px';
                    } else this._HyderError(new Error(`Type not supported for button`));                     
                } else this._HyderError(new TypeError(`Expected type string but got ${typeof content.type}`));                 
            }
        return tag;  
    }
    _ListItem(content, elem) {
        if(content.items.length) {                
            content.items.map(item => {                                
                if(item.text && item.text !== '') {
                    let itemTag = document.createElement('li');                                                             
                    itemTag.innerHTML = item.text;
                    this._defaultStyling(item, itemTag);   
                    elem.append(itemTag);
                } else this._HyderError(new SyntaxError("Property text is not specified and cannot be undefined or empty"));                 
            });
            return elem;
        } else this._HyderError(new SyntaxError("List Item cannot be empty atleast one item is required"));                          
    }
    _List(content) {
        // creating a element
        if(content.listType && content.listType !== '') {            
            if(content.listType === 'ordered') {
                let tag = document.createElement('ol');  
                // default styling                
                tag.style.listStyleType = "decimal";
                this._defaultStyling(content, tag);
                return this._ListItem(content, tag);
            } else if(content.listType === 'unordered') {                
                let tag = document.createElement('ul');                
                // default styling            
                tag.style.listStyleType = "disc";
                this._defaultStyling(content, tag);
                return this._ListItem(content, tag);
            } else {
                let tag = document.createElement('ul');                
                // default styling
                tag.style.listStyleType = "none";
                this._defaultStyling(content, tag);
                return this._ListItem(content, tag);
            }            

        } else this._HyderError(new SyntaxError("Type is not specified and cannot be undefined or empty"));                 
    }
    _Dropdown(content) {
        let tag = document.createElement('select');                     
            this._defaultStyling(content, tag);
             // default styling
            tag.style.outline = "none";
            tag.style.border = "1px solid #e2e8f0";
            tag.style.padding = '0.5rem';
            tag.style.borderRadius = "4px";
            tag.style.fontStyle = "1.5rem";
            tag.style.margin = "1rem";
            if(content.options && typeof content.options === 'object') {
                if(content.options.length >= 1) {
                    content.options.map(option => {
                        let opt = document.createElement('option');                     
                        //default styling                    
                        if(option.value) opt.value = option.value;
                        else this._HyderError(new TypeError("Invalid or value for option not specified"));                                                               
                        if(option.selected) opt.selected = option.selected;
                        if(option.disabled) opt.disabled = option.disabled;                        
                        opt.innerHTML = option.text;                        
                        tag.append(opt);                    
                    });                               
                } else this._HyderError(new SyntaxError("Select Option cannot be empty atleast one item is required"));                                          
            } else this._HyderError(new TypeError("Value specified for property options is not valid array expected"));                                       
        return tag;   
    }
    _Image(content) {
        // creating element
        let tag = document.createElement('img');
        this._defaultStyling(content, tag);
        // default insertion
        if(content.src && content.src !== '') {
            if(typeof content.src === 'string') {
                tag.src = content.src;
            } else this._HyderError(new TypeError(`Expected src type string but got ${typeof content.src}`));                                        
        } else this._HyderError(new TypeError("Invalid type or undefined specified for image src"));         
        return tag;
    }
    _HyderContainer(content) {
        // creating the element
        let tag = document.createElement('div');
        this._defaultStyling(content, tag);
        tag.style.display = "flex";
        if(content.shadow) {                
            tag.style.boxShadow = "0 1px 3px 0 rgba(0,0,0,.1)";
        }
        if(content.borderRadius) {
            tag.style.borderRadius = `${content.borderRadius}px`;
        }
        if(content.textColor && content.textColor !== '') {             
           tag.style.color = content.textColor;
        }
        // bg color check
        if(content.bgColor && content.bgColor !== '') {
            tag.style.backgroundColor = content.bgColor;
        }       
        if(content.arrange && content.arrange !=='') {
            if(content.arrange === 'column') {                                
                tag.style.flexDirection = "column";
            } else if(content.arrange === 'row') {
                tag.style.flexDirection = "row";
            } else {
                this._HyderError(new TypeError("Invalid or undefined property for arrangment"));
            }
        }

        if(content.align && content.align !== '') {
            tag.style.alignItems = content.align;                                 
        } 

        if(content.space && content.space !== '') {
            tag.style.justifyContent = content.space;                                 
        }
        
        if(content.items.length) {            
            new HyderJS({bricks: content.items, wall: tag});
        }
        return tag;
    }
    _Break(content) {
        if(content.type && content.type !== '') {
            if(content.type === 'hr' || content.type === 'br') {
                let tag = document.createElement(content.type);
                this._defaultStyling(content, tag);              
                return tag;
            } else this._HyderError(new TypeError("Type specified not supported"));

        } else this._HyderError(new SyntaxError("Invalid or property type not specified"));         
    }
    _Form(content) {
        let tag = document.createElement('form');
        this._defaultStyling(content, tag);
        // default styling
        tag.style.outline = "none";
        tag.style.border = "1px solid #e2e8f0";
        tag.style.padding = '0.7rem';
        tag.style.borderRadius = "4px";
        tag.style.fontStyle = "1.5rem";
        if(!content.margin) tag.style.margin = "1rem";
        if(content.default && content.default !== '') {
            if(typeof content.default === 'boolean') {
                if(content.default) tag.addEventListener("submit", function(e){e.preventDefault();}) 
            } else this._HyderError(new TypeError("Invalid type for property default expected boolean"));
        }
        if(content.action && content.action !== '') {
            tag.action = content.action;
        }
        if(content.method && content.method !== '') {
            tag.method = content.method;
        }
        // check styling props
        if(!content.display) tag.style.display = "flex";
        if(!content.flexDirection) tag.style.flexDirection = "column";
        if(!content.alignItems) tag.style.alignItems = "center";
        if(!content.width) tag.style.width = "30%";
        if(content.width) tag.style.width = `${parseInt(content.width)}%`;
        if(content.margin) if(content.margin.x) tag.style.marginLeft = tag.style.marginRight = `${parseInt(content.margin.x)*0.5}rem`;
        if(content.margin) if(content.margin.y) tag.style.marginTop = tag.style.marginBottom = `${parseInt(content.margin.y)*0.5}rem`;
        if(typeof content.items === 'object') {
            if(content.items.length >= 1) {
                new HyderJS({bricks: content.items, wall: tag});                
            } else this._HyderError(new SyntaxError("Items cannot be empty atleast one required"));
        } else this._HyderError(new TypeError("Type not supported for the items specified expected array"));

        return tag;

    }
    _Card(content) {
        // creating the element
        let tag = this._HyderContainer(content);
        // default styling
        tag.style.border = "1px solid #e2e8f0";
        tag.style.padding = '0.7rem';
        tag.style.borderRadius = "4px";
        if(content.shadow) {
            if(content.shadow === 'small') {
                tag.style.boxShadow = `0 1px 3px 0 rgba(0,0,0,.1)`;
            } else if(content.shadow === "medium") {
                tag.style.boxShadow = `0 1px 3px 0 rgba(0,0,0,.3)`;
            } else if(content.shadow === 'large') {
                tag.style.boxShadow = `0 2px 4px 0 rgba(0,0,0,.4)`;
            } else if(content.shadow === true) {                
                tag.style.boxShadow = `0 1px 3px 0 rgba(0,0,0,.1)`;            
            } else this._HyderError(new SyntaxError("Specified type of shadow not supported."));
        } 
        return tag;
    }
    _Modal(content) {
        // default insertion
        let cancelModal = function() { state[content.ref].style.display = "none"; }
        let HyderBreak = {
            type: "break",
            data: {
                type: "hr",
                padding: 0,
                margin: 0,
                style: {
                    width: "100%"                        
                }
            }
        };
        let items = [
            {
                type: "text",
                data: {
                    text: content.text || "Modal Title",
                    style: {
                        fontWeight: 800,
                        fontSize: "15px",
                        textAlign: "left"                        
                    }                    
                }
            },
            HyderBreak,
            {
                type: "container",                
                data: {
                    items: content.modalItems || [{type: "text", data:{text:"Modal Content"}}]
                }
            },
            HyderBreak,
            {
                type: "container",
                data: { items: [
                    {
                        type: "button", data: { type: "elegant", text: "Cancel", margin: { x: 2 }, onclick: cancelModal || content.cancelModal }
                    },
                    {
                        type: "button", data: { type: "elegant", text: "Okay"}
                    }
                ] }
            }
        ];
        content.arrange = "column";
        content.items = items;        
        // creating the element
        let outerContainer = document.createElement('div'); 
        if(content.ref) state[content.ref] = outerContainer;                      
        outerContainer.style.width = "100%";
        outerContainer.style.height = "100%";
        outerContainer.style.backgroundColor = "rgba(0,0,0,0.1)";
        outerContainer.style.position = "fixed";
        outerContainer.style.top = 0;
        outerContainer.style.left = 0;
        outerContainer.style.right = 0;
        outerContainer.style.display = "none";
        outerContainer.style.alignItems = "center"; outerContainer.style.justifyContent = "center";
        let tag = this._HyderContainer(content);
        // default styling        
        tag.style.width = "500px";
        tag.style.border = "1px solid #e2e8f0";
        tag.style.padding = '0.7rem';
        tag.style.borderRadius = "5px";
        tag.style.backgroundColor = "white";
        tag.style.boxShadow = `0 1px 3px 0 rgba(0,0,0,.3)`;
        outerContainer.append(tag);

        return outerContainer;

    }
}

class HyderJS extends Component{
    constructor(obj) {
        super();
        this.bricks = obj.bricks;
        this.parent = document.getElementById(obj.wall) || obj.wall;                      
        this._defaultPageStyling();
        this.bricks.map(i => {
            if(i.type === "heading") {
                this.parent.append(this._Heading(i.data));
            }
            if(i.type === "text") {
                this.parent.append(this._Paragraph(i.data));
            }
            if(i.type === "link") {
                this.parent.append(this._Anchor(i.data));
            }
            if(i.type === "input") {
                this.parent.append(this._Input(i.data));
            }
            if(i.type === "button") {
                this.parent.append(this._Button(i.data));
            }
            if(i.type === "list") {
                this.parent.append(this._List(i.data));
            }
            if(i.type === "dropdown") {
                this.parent.append(this._Dropdown(i.data));
            }
            if(i.type === "image") {
                this.parent.append(this._Image(i.data));
            }
            if(i.type === "container") {
                this.parent.append(this._HyderContainer(i.data));
            }
            if(i.type === "break") {
                this.parent.append(this._Break(i.data));
            }
            if(i.type === "form") {
                this.parent.append(this._Form(i.data));
            }
            if(i.type === "card") {
                this.parent.append(this._Card(i.data));
            }
            if(i.type === "modal") {
                this.parent.append(this._Modal(i.data));
            }
            if(typeof i.type !== "string") this._HyderError(new TypeError(`Expected component type string but got ${typeof i.type}`))
        });            
    }    

    _defaultPageStyling() {
        let page = document.querySelector('html').style; 
        page.width = "100%";
        page.height ="100%";
        page.zIndex ="10";
        page.margin = 0;
        page.fontFamily = "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue','Arial','Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'";
        page.lineHeight = 1.5;        
        page.boxSizing = "border-box";
        document.querySelector('body').style.margin = 0;
    }            
        
}
