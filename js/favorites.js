import { GithubUser } from "./githubUser.js";
//clase que vai conter a logia dos dados
//como os dados seram estruturados

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();

    GithubUser.search().then(user =>console.log(user))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }


  save (){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }
  async add(username){
    try{
        const userExists = this.entries.find(entry => entry.login ===username)

        if(userExists){
            throw new Error("Usuário ja cadastrado!")
        }


        const user = await GithubUser.search(username)

        if(user.login === undefined){
            throw new Error("Usuários não encontrado")
        }

        this.entries =[user, ...this.entries]
        this.update()
        this.save()
    }catch(error){
        alert(error.message)
    }
    

  }

  delete(user) {
    //higher-order functions (map, filter, find, reduce)
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save()
  }
}


//classe que vai criar a visualização e eventos do html

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root);

    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd(){
    const addButto = this.root.querySelector(".search button")
    addButto.onclick = () =>{
        const {value} = this.root.querySelector('.search input')

        this.add(value)
    }
  }



  update() {
    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.creatRow();
      row.querySelector(".user img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".user img").alt = `Imagem de ${user.name}`;
      row.querySelector(".user p").textContent = user.name;
      row.querySelector(".user a").href = `https://github.com/${user.login}`;
      row.querySelector(".user span").textContent = user.login;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOK = confirm(`Tem certeza que deseja deletar ${user.name}`);
        if (isOK) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  creatRow() {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        
            <td class="user">
              <img src="" alt="" />
              <a href="" target="_blank" >
                <p></p>
                <span></span>
              </a>
            </td>
            <td class="repositories"></td>
            <td class="followers"></td>
            <td>
                <button class="remove">&times;</button>
            </td>
          
        `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}

