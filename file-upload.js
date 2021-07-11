// Create template
const template = document.createElement('template');
template.innerHTML = /*html*/`
  <style>
      :host {
        font-size: 13px;
        font-family: arial;
      }
      article {
          display: flex;
          align-items: center;
      }
      label {
        background-color: rgb(239, 239, 239);
        border: 1px solid rgb(118, 118, 118);
        padding: 2px 6px 2px 6px;
        border-radius: 2px;
        margin-right: 5px;
      }
      button {
          border:0;
          background: transparent;
          cursor: pointer;
      }
      button::before {
          content: '\\2716';
      }
  </style>
  <article>
    <label part="upload-button" for="fileUpload">Upload</label>
    <section hidden>
      <span></span><button></button>
    </section>
  </article>
  <input hidden id="fileUpload" type="file" />
`;

class FileUpload extends HTMLElement {
  constructor() {
    // Inititialize custom component
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    // Add event listeners
    this.select('input').onchange = (e) => this.handleChange(e);
    this.select('button').onclick = () => this.handleRemove();
  }

  handleChange(e) {
      const file = e.target.files[0];
      this.select('section').style.display = "block";
      this.select('span').innerText = file.name;
      this.dispatch('change', file);
  }

  handleRemove() {
    const el = this.select('input');
    const file = el.files[0];
    el.value = "";
    this.select('section').style.display = "none";
    this.dispatch('change', file);
  }

  static get observedAttributes() {
    return ['upload-label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'upload-label') {
        if (newValue && newValue !== '') {
            this.select('label').innerText = newValue;
        }
    }
  }

  dispatch(event, arg) {
    this.dispatchEvent(new CustomEvent(event, {detail: arg}));
  }

  get select() {
    return this.shadowRoot.querySelector.bind(this.shadowRoot);
  }
}

window.customElements.define('file-upload', FileUpload);