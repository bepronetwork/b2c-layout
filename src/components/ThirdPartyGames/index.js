import React, { Component } from "react";
import { Typography } from 'components';
import { connect } from "react-redux";
import _ from 'lodash';
import "./index.css";

class ThirdPartyGames extends Component {

    constructor(props){
        super(props);
        this.state = {
        };
    }

    componentDidMount(){
        this.projectData(this.props);
    }

    componentWillReceiveProps(props){
        this.projectData(props);
    }

    projectData = async (props) => {

    }

    render() {
        return (
            <div>
                <div styleName="providers">
                    <div styleName="title">
                        <Typography variant={'small-body'} color={'white'} weight={'bold'}>Providers</Typography>
                    </div>
                    <div styleName="carousel">
                        <div styleName="body">
                            <div class="styles__Wrap-shsmns-0 gaCOHP" style={{opacity: "0.3"}}>
                                <a class="styles__Link-shsmns-2 jxnQRV" href="/casino/group/pragmatic-play">
                                    <div class="styles__ImgWrap-shsmns-1 iJzvhr"><img draggable="false" alt="Pragmatic Play" class="styles__ImgixImage-shsmns-4 iWgbLe" width="175" src="https://mediumrare.imgix.net/0277f0d0636f858c7c7b54f6f4882650102f1e2153859f79f13355a4aa0d3fbd?auto=format&q=80&ixlib=react-9.0.2&w=200" /></div>
                                </a>
                            </div>
                            <div class="styles__Wrap-shsmns-0 gaCOHP">
                                <a class="styles__Link-shsmns-2 jxnQRV" href="/casino/group/no-limit-city">
                                    <div class="styles__ImgWrap-shsmns-1 iJzvhr"><img draggable="false" alt="No Limit City" class="styles__ImgixImage-shsmns-4 iWgbLe" width="175" src="https://mediumrare.imgix.net/fffebb8ad954c1fdcaca444cf83308ef0226ea06f8aa7a8d0a4e5f50c1d433c7?auto=format&;q=80&;ixlib=react-9.0.2&;w=200" /></div>
                                </a>
                            </div>
                            <div class="styles__Wrap-shsmns-0 gaCOHP" style={{opacity: "0.3"}}>
                                <a class="styles__Link-shsmns-2 jxnQRV" href="/casino/group/relax-gaming">
                                    <div class="styles__ImgWrap-shsmns-1 iJzvhr"><img draggable="false" alt="Relax Gaming" class="styles__ImgixImage-shsmns-4 iWgbLe" width="175" src="https://mediumrare.imgix.net/c2d8f03f4b3dccf296186fe782043ebf37a6cba1b53fa1fb0d1e544f2efe129f?auto=format&;q=80&;ixlib=react-9.0.2&;w=200" /></div>
                                </a>
                            </div>
                            <div class="styles__Wrap-shsmns-0 gaCOHP" style={{opacity: "0.3"}}>
                                <a class="styles__Link-shsmns-2 jxnQRV" href="/casino/group/evolution-gaming">
                                    <div class="styles__ImgWrap-shsmns-1 iJzvhr"><img draggable="false" alt="Evolution Gaming" class="styles__ImgixImage-shsmns-4 iWgbLe" width="175" src="https://mediumrare.imgix.net/99a8d104f80fab1ca964f6de4367f87337ddb6efd6325fbf63e71b2c90f960b9?auto=format&;q=80&;ixlib=react-9.0.2&;w=200" /></div>
                                </a>
                            </div>
                            <div class="styles__Wrap-shsmns-0 gaCOHP" style={{opacity: "0.3"}}>
                                <a class="styles__Link-shsmns-2 jxnQRV" href="/casino/group/thunderkick">
                                    <div class="styles__ImgWrap-shsmns-1 iJzvhr"><img draggable="false" alt="Thunderkick" class="styles__ImgixImage-shsmns-4 iWgbLe" width="175" src="https://mediumrare.imgix.net/09d73f4ba8167c7e0ec9c0cfd1ae8b6c3ad5934e24fbe85a6404023c1b860660?auto=format&;q=80&;ixlib=react-9.0.2&;w=200" /></div>
                                </a>
                            </div>
                            <div class="styles__Wrap-shsmns-0 gaCOHP" style={{opacity: "0.3"}}>
                                <a class="styles__Link-shsmns-2 jxnQRV" href="/casino/group/stake-games">
                                    <div class="styles__ImgWrap-shsmns-1 iJzvhr"><img draggable="false" alt="Stake Originals" class="styles__ImgixImage-shsmns-4 iWgbLe" width="175" src="https://mediumrare.imgix.net/8e443b9bc9306554328540c75fc25ba03ee26adeec31367f4555705ff2c51447?auto=format&;q=80&;ixlib=react-9.0.2&;w=200"/></div>
                                </a>
                            </div>
                        </div>
                        <a styleName="carousel-control-prev" href="#carousel-example" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                        </a>
                        <a styleName="carousel-control-next" href="#carousel-example" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                        </a>
                    </div>
                </div>
                <div styleName="games">
                    <div width="177" styleName="game-list">
                        <div class="styles__Wrap-bsen9-0 bSJAtz">
                            <a class="styles__Link-bsen9-2 dtjmUy" href="/casino/games/redtiger-gonzos-quest-megaways">
                                <div class="styles__ImgWrap-bsen9-1 hKeIVy"><img width="175" draggable="false" alt="Gonzo's Quest Megaways" src="https://mediumrare.imgix.net/f16453344611f1bd693a689fff5b586e684385b3bc0dd006224626c3bc4efc36" class="styles__Img-bsen9-3 mbXbU"/></div>
                            </a>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <h2 color="#fff" class="Title__H2-sc-1ncj9v4-1 styles__GameName-bsen9-10 gARRgi"><a class="Link-q08rh0-0 fmmuEY" href="/casino/games/redtiger-gonzos-quest-megaways"><Typography variant={'small-body'} color={'white'} weight={'bold'}>Gonzo's Quest Megaways</Typography></a></h2>
                            </div>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <a class="Link-q08rh0-0 jqmhSE" href="/casino/group/red-tiger"><Typography variant={'x-small-body'} color={'grey'}>Red Tiger</Typography></a>
                            </div>
                        </div>
                        <div class="styles__Wrap-bsen9-0 bSJAtz">
                            <a class="styles__Link-bsen9-2 dtjmUy" href="/casino/games/pragmatic-sweet-bonanza">
                                <div class="styles__ImgWrap-bsen9-1 hKeIVy"><img width="175" draggable="false" alt="Sweet Bonanza" src="https://mediumrare.imgix.net/9b89d0c0be7be4631d204327a9c209c8bc7df61e4d9b0c3fb79d1cca0ecc3c7c" class="styles__Img-bsen9-3 mbXbU"/></div>
                            </a>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <h2 color="#fff" class="Title__H2-sc-1ncj9v4-1 styles__GameName-bsen9-10 gARRgi"><a class="Link-q08rh0-0 fmmuEY" href="/casino/games/pragmatic-sweet-bonanza"><Typography variant={'small-body'} color={'white'} weight={'bold'}>Sweet Bonanza</Typography></a></h2>
                            </div>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <a class="Link-q08rh0-0 jqmhSE" href="/casino/group/pragmatic-play"><Typography variant={'x-small-body'} color={'grey'}>Pragmatic Play</Typography></a>
                            </div>
                        </div>
                        <div class="styles__Wrap-bsen9-0 bSJAtz">
                            <a class="styles__Link-bsen9-2 dtjmUy" href="/casino/games/nolimit-dragon-tribe">
                                <div class="styles__ImgWrap-bsen9-1 hKeIVy"><img width="175" draggable="false" alt="Dragon Tribe" src="https://mediumrare.imgix.net/af83d428016301f6521960da7d8c5dea94bd1873a94afcdc6bf152192198e1f4" class="styles__Img-bsen9-3 mbXbU"/></div>
                            </a>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <h2 color="#fff" class="Title__H2-sc-1ncj9v4-1 styles__GameName-bsen9-10 gARRgi"><a class="Link-q08rh0-0 fmmuEY" href="/casino/games/nolimit-dragon-tribe"><Typography variant={'small-body'} color={'white'} weight={'bold'}>Dragon Tribe</Typography></a></h2>
                            </div>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <a class="Link-q08rh0-0 jqmhSE" href="/casino/group/no-limit-city"><Typography variant={'x-small-body'} color={'grey'}>No Limit City</Typography></a>
                            </div>
                        </div>
                        <div class="styles__Wrap-bsen9-0 bSJAtz">
                            <a class="styles__Link-bsen9-2 dtjmUy" href="/casino/games/relax-snake-arena">
                                <div class="styles__ImgWrap-bsen9-1 hKeIVy"><img width="175" draggable="false" alt="Snake Arena" src="https://mediumrare.imgix.net/46a1c10873fdfc7c0b76d4cad1ab10db2e3b8d73481deaab99e56b50b5e673f9" class="styles__Img-bsen9-3 mbXbU"/></div>
                            </a>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <h2 color="#fff" class="Title__H2-sc-1ncj9v4-1 styles__GameName-bsen9-10 gARRgi"><a class="Link-q08rh0-0 fmmuEY" href="/casino/games/relax-snake-arena"><Typography variant={'small-body'} color={'white'} weight={'bold'}>Snake Arena</Typography></a></h2>
                            </div>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <a class="Link-q08rh0-0 jqmhSE" href="/casino/group/relax-gaming"><Typography variant={'x-small-body'} color={'grey'}>Relax Gaming</Typography></a>
                            </div>
                        </div>
                        <div class="styles__Wrap-bsen9-0 bSJAtz">
                            <a class="styles__Link-bsen9-2 dtjmUy" href="/casino/games/pragmatic-the-dog-house-megaways">
                                <div class="styles__ImgWrap-bsen9-1 hKeIVy"><img width="175" draggable="false" alt="The Dog House Megaways" src="https://mediumrare.imgix.net/d79fa7ec79108224d1e4bdf5fbdbb0ced329cf8b4ae6a5742e9c8f24fd29a124" class="styles__Img-bsen9-3 mbXbU"/></div>
                            </a>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <h2 color="#fff" class="Title__H2-sc-1ncj9v4-1 styles__GameName-bsen9-10 gARRgi"><a class="Link-q08rh0-0 fmmuEY" href="/casino/games/pragmatic-the-dog-house-megaways"><Typography variant={'small-body'} color={'white'} weight={'bold'}>The Dog House Megaways</Typography></a></h2>
                            </div>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <a class="Link-q08rh0-0 jqmhSE" href="/casino/group/pragmatic-play"><Typography variant={'x-small-body'} color={'grey'}>Pragmatic Play</Typography></a>
                            </div>
                        </div>
                        <div class="styles__Wrap-bsen9-0 bSJAtz">
                            <a class="styles__Link-bsen9-2 dtjmUy" href="/casino/games/pragmatic-fruit-party">
                                <div class="styles__ImgWrap-bsen9-1 hKeIVy"><img width="175" draggable="false" alt="Fruit Party" src="https://mediumrare.imgix.net/7223bf1e48a74f8b941960ef2f686bd833b3204952f68715ad3fe91abc8addd9" class="styles__Img-bsen9-3 mbXbU"/></div>
                            </a>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <h2 color="#fff" class="Title__H2-sc-1ncj9v4-1 styles__GameName-bsen9-10 gARRgi"><a class="Link-q08rh0-0 fmmuEY" href="/casino/games/pragmatic-fruit-party"><Typography variant={'small-body'} color={'white'} weight={'bold'}>Fruit Party</Typography></a></h2>
                            </div>
                            <div class="styles__Info-bsen9-6 kxLWeB">
                                <a class="Link-q08rh0-0 jqmhSE" href="/casino/group/pragmatic-play"><Typography variant={'x-small-body'} color={'grey'}>Pragmatic Play</Typography></a>

                            </div>
                        </div>
                    </div>
                    <a styleName="carousel-control-prev" href="#carousel-example" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a styleName="carousel-control-next" href="#carousel-example" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {
        profile: state.profile,
        ln : state.language
    };
}

export default connect(mapStateToProps)(ThirdPartyGames);
