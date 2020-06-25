export const games = [
    {
        id: 1,
        name: "Fifa",
        image: "https://luckbox.com/8c002419a341c0ef6b252f8477ddf02f.png"
    },
    {
        id: 2,
        name: "LoL",
        image: "https://luckbox.com/b72dd98cee9f0cc48c76f6ae6bedd369.png"
    },
    {
        id: 3,
        name: "NBA",
        image: "https://luckbox.com/155797c2f6f216b3ef490783bb6569e1.png"
    },
    {
        id: 4,
        name: "Dota",
        image: "https://luckbox.com/dd7ff15e4fb54618aa55a8315648a765.png"
    }
]

export const tournaments = [
    {
        id: 123,
        name: "Data 2 league",
        game: {
            id: 1,
            name: "Fifa",
            image: "https://luckbox.com/8c002419a341c0ef6b252f8477ddf02f.png"
        }
    },
    {
        id: 321,
        name: "WePlay!",
        game: {
            id: 2,
            name: "LoL",
            image: "https://luckbox.com/b72dd98cee9f0cc48c76f6ae6bedd369.png"
        }
    },
    {
        id: 567,
        name: "Combat Tour!",
        game: {
            id: 3,
            name: "NBA",
            image: "https://luckbox.com/155797c2f6f216b3ef490783bb6569e1.png"
        }
    },
    {
        id: 789,
        name: "World Division",
        game: {
            id: 4,
            name: "Dota",
            image: "https://luckbox.com/dd7ff15e4fb54618aa55a8315648a765.png"
        }
    }
]

export const matches = [
    {
        id: 7,
        tournament: {
            id: 123,
            name: "Data 2 league",
            game: {
                id: 1,
                name: "Fifa",
                image: "https://luckbox.com/8c002419a341c0ef6b252f8477ddf02f.png"
            }
        },
        image: "https://s2.glbimg.com/5P4HBa1Sg_HwW1T01miRLey9vhM=/0x0:1920x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_08fbf48bc0524877943fe86e43087e7a/internal_photos/bs/2018/N/3/PmCJGBQAepOCbBgRhuBQ/captura-de-tela-2018-07-24-as-14.13.24.png",
        round: "Europe playoffs",
        isLive: true,
        isVideoTransmition: false,
        videoTransmition: "",
        date: "2020/06/10 20:00",
        teams : [
            {
                id: 1,
                name: "Rugate Malon",
                country: "https://image.flaticon.com/icons/svg/197/197374.svg",
                score: 5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/496-2019-new-logo.png",
                stats: [
                    {
                        month: "MAY",
                        year: "2020",
                        rate: 13
                    },
                    {
                        month: "APR",
                        year: "2020",
                        rate: 80
                    },
                    {
                        month: "MAR",
                        year: "2020",
                        rate: 55
                    },
                    {
                        month: "FEB",
                        year: "2020",
                        rate: 97
                    },
                    {
                        month: "JAN",
                        year: "2020",
                        rate: 57
                    },
                    {
                        month: "OCT",
                        year: "2020",
                        rate: 61
                    },
                    {
                        month: "DEC",
                        year: "2020",
                        rate: 26
                    }
                ],
                players: [
                    {
                        nickName: "jTex",
                        fullName: "John",
                        country: "https://image.flaticon.com/icons/svg/197/197560.svg"
                    },
                    {
                        nickName: "Calv",
                        fullName: "Moraes",
                        country: "https://image.flaticon.com/icons/svg/197/197374.svg"
                    }
                ]
            },
            {
                id: 2,
                name: "Wiggle Morlen",
                country: "https://image.flaticon.com/icons/svg/197/197484.svg",
                score: 3,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/MIBR-teamlogoNEW.png",
                stats: [
                    {
                        month: "JUN",
                        year: "2020",
                        rate: 73
                    },
                    {
                        month: "APR",
                        year: "2020",
                        rate: 26
                    },
                    {
                        month: "MAR",
                        year: "2020",
                        rate: 52
                    },
                    {
                        month: "FEB",
                        year: "2020",
                        rate: 80
                    },
                    {
                        month: "JAN",
                        year: "2020",
                        rate: 47
                    },
                    {
                        month: "SEP",
                        year: "2020",
                        rate: 48
                    },
                    {
                        month: "NOV",
                        year: "2020",
                        rate: 11
                    }
                ],
                players: [
                    {
                        nickName: "junO",
                        fullName: "Justin Mix",
                        country: "https://image.flaticon.com/icons/svg/197/197560.svg"
                    },
                    {
                        nickName: "corsario",
                        fullName: "Yago Sarmento",
                        country: "https://image.flaticon.com/icons/svg/197/197484.svg"
                    }
                ]
            }
        ]
    },
    {
        id: 8,
        tournament: {
            id: 123,
            name: "Data 2 league",
            game: {
                id: 1,
                name: "Fifa",
                image: "https://luckbox.com/8c002419a341c0ef6b252f8477ddf02f.png"
            }
        },
        image: "https://i.mlcdn.com.br/portaldalu/fotosconteudo/55652.jpg",
        round: "Final",
        isLive: true,
        isVideoTransmition: true,
        videoTransmition: "https://www.youtube.com/embed/LiCVejA7kJM",
        date: "2020/06/18 21:00",
        teams : [
            {
                id: 3,
                name: "Totatota",
                country: "https://image.flaticon.com/icons/svg/197/197473.svg",
                score: 5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/Boom-teamlogo.png",
                stats: [
                    {
                        month: "MAY",
                        year: "2020",
                        rate: 43
                    },
                    {
                        month: "APR",
                        year: "2020",
                        rate: 80
                    },
                    {
                        month: "MAR",
                        year: "2020",
                        rate: 15
                    },
                    {
                        month: "FEB",
                        year: "2020",
                        rate: 100
                    },
                    {
                        month: "JAN",
                        year: "2020",
                        rate: 57
                    },
                    {
                        month: "OCT",
                        year: "2020",
                        rate: 61
                    },
                    {
                        month: "DEC",
                        year: "2020",
                        rate: 21
                    }
                ],
                players: [
                    {
                        nickName: "jTex",
                        fullName: "John",
                        country: "https://image.flaticon.com/icons/svg/197/197473.svg"
                    },
                    {
                        nickName: "Calv",
                        fullName: "Moraes",
                        country: "https://image.flaticon.com/icons/svg/197/197484.svg"
                    }
                ]
            },
            {
                id: 4,
                name: "Crew Junk",
                country: "https://image.flaticon.com/icons/svg/197/197484.svg",
                score: 3,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/Blaze-teamlogoNEW.png",
                stats: [
                    {
                        month: "MAY",
                        year: "2020",
                        rate: 73
                    },
                    {
                        month: "APR",
                        year: "2020",
                        rate: 56
                    },
                    {
                        month: "MAR",
                        year: "2020",
                        rate: 12
                    },
                    {
                        month: "FEB",
                        year: "2020",
                        rate: 80
                    },
                    {
                        month: "JAN",
                        year: "2020",
                        rate: 52
                    },
                    {
                        month: "OCT",
                        year: "2020",
                        rate: 65
                    },
                    {
                        month: "DEC",
                        year: "2020",
                        rate: 61
                    }
                ],
                players: [
                    {
                        nickName: "ZenBind",
                        fullName: "Cart Senior",
                        country: "https://image.flaticon.com/icons/svg/197/197484.svg"
                    },
                    {
                        nickName: "ddGuimes",
                        fullName: "David Crumer",
                        country: "https://image.flaticon.com/icons/svg/197/197484.svg"
                    }
                ]
            }
        ]
    },
    {
        id: 9,
        tournament: {
            id: 321,
            name: "WePlay!",
            game: {
                id: 2,
                name: "LoL",
                image: "https://luckbox.com/b72dd98cee9f0cc48c76f6ae6bedd369.png"
            }
        },
        image: "https://s2.glbimg.com/bZPWdlkwpATF-56nvyEPtMw9loo=/0x0:1920x1080/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2019/A/i/jUU5YDQaK7eWBUR1QBBQ/wild-rift-gameplay.jpg",
        round: "Semi Final",
        isLive: false,
        isVideoTransmition: false,
        videoTransmition: "",
        date: "2020/06/17 21:00",
        teams : [
            {
                id: 5,
                name: "Mix Monsters",
                country: "https://image.flaticon.com/icons/svg/197/197463.svg",
                score: 5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/Invictus-gaming-young.png",
                stats: [
                    {
                        month: "MAY",
                        year: "2020",
                        rate: 43
                    },
                    {
                        month: "APR",
                        year: "2020",
                        rate: 80
                    },
                    {
                        month: "MAR",
                        year: "2020",
                        rate: 15
                    },
                    {
                        month: "FEB",
                        year: "2020",
                        rate: 100
                    },
                    {
                        month: "DEC",
                        year: "2020",
                        rate: 21
                    },
                    {
                        month: "OCT",
                        year: "2020",
                        rate: 61
                    }
                ],
                players: [
                    {
                        nickName: "jTex",
                        fullName: "João Couto",
                        country: "https://image.flaticon.com/icons/svg/197/197463.svg"
                    },
                    {
                        nickName: "Calv",
                        fullName: "Moraes",
                        country: "https://image.flaticon.com/icons/svg/197/197374.svg"
                    }
                ]
            },
            {
                id: 6,
                name: "Premium Go",
                country: "https://image.flaticon.com/icons/svg/197/197386.svg",
                score: 3,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/Team-Sirius-temlogo.png",
                stats: [
                    {
                        month: "MAY",
                        year: "2020",
                        rate: 73
                    },
                    {
                        month: "APR",
                        year: "2020",
                        rate: 16
                    },
                    {
                        month: "MAR",
                        year: "2020",
                        rate: 92
                    },
                    {
                        month: "FEB",
                        year: "2020",
                        rate: 80
                    },
                    {
                        month: "OCT",
                        year: "2020",
                        rate: 41
                    },
                    {
                        month: "SEP",
                        year: "2020",
                        rate: 21
                    },
                    {
                        month: "NOV",
                        year: "2020",
                        rate: 61
                    }
                ],
                players: [
                    {
                        nickName: "raitonico",
                        fullName: "Raimundo Charles",
                        country: "https://image.flaticon.com/icons/svg/197/197386.svg"
                    },
                    {
                        nickName: "rIck50",
                        fullName: "Ricardo Lemos",
                        country: "https://image.flaticon.com/icons/svg/197/197463.svg"
                    }
                ]
            }
        ]
    }
]

export const betSlips = [
    {
        id: 1,
        match: 7,
        title: "Winner, Full Match",
        options: [
            {
                id: 100,
                team: 1,
                name: "Rugate Malon",
                value: 1.5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/496-2019-new-logo.png"
            },
            {
                id: 101,
                team: 2,
                name: "Wiggle Morlen",
                value: 0.5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/MIBR-teamlogoNEW.png"
            }

        ]
    },
    {
        id: 2,
        match: 7,
        title: "Winner, Map 3",
        options: [
            {
                id: 103,
                team: 1,
                name: "Rugate Malon",
                value: 3.5
            },
            {
                id: 104,
                team: 2,
                name: "Wiggle Morlen",
                value: 1.45
            }

        ]
    },
    {
        id: 3,
        match: 7,
        title: "Under 18",
        options: [
            {
                id: 105,
                team: 1,
                name: "Rugate Malon",
                value: 2.96
            },
            {
                id: 106,
                team: 2,
                name: "Wiggle Morlen",
                value: 1.2
            }

        ]
    },
    {
        id: 4,
        match: 8,
        title: "Winner, Full Match",
        options: [
            {
                id: 107,
                team: 3,
                name: "Totatota",
                value: 2.5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/Boom-teamlogo.png"
            },
            {
                id: 108,
                team: 4,
                name: "Crew Junk",
                value: 1.5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/Blaze-teamlogoNEW.png"
            }

        ]
    },
    {
        id: 5,
        match: 8,
        title: "Round Advantage, Full Match",
        options: [
            {
                id: 109,
                team: 3,
                name: "Totatota",
                value: 1.5
            },
            {
                id: 110,
                team: 4,
                name: "Crew Junk",
                value: 0.5
            }

        ]
    },
    {
        id: 6,
        match: 8,
        title: "Winner, Round 1 (Map 1)",
        options: [
            {
                id: 111,
                team: 3,
                name: "Totatota",
                value: 1.85
            },
            {
                id: 112,
                team: 4,
                name: "Crew Junk",
                value: 2.5
            }

        ]
    },
    {
        id: 7,
        match: 8,
        title: "Winner, Round 16 (Map 1)",
        options: [
            {
                id: 113,
                team: 3,
                name: "Totatota",
                value: 2.32
            },
            {
                id: 114,
                team: 4,
                name: "Crew Junk",
                value: 1.64
            }

        ]
    },
    {
        id: 8,
        match: 9,
        title: "Round Advantage, Full Match",
        options: [
            {
                id: 115,
                team: 5,
                name: "Mix Monsters",
                value: 2.5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/Invictus-gaming-young.png"
            },
            {
                id: 116,
                team: 6,
                name: "Premium Go",
                value: 1.5,
                flag: "https://img.abiosgaming.com/competitors/thumbnails/Team-Sirius-temlogo.png"
            }

        ]
    },
    {
        id: 9,
        match: 9,
        title: "Winner, Round 16 (Map 1)",
        options: [
            {
                id: 117,
                team: 5,
                name: "Mix Monsters",
                value: 2.32
            },
            {
                id: 118,
                team: 6,
                name: "Premium Go",
                value: 1.64
            }

        ]
    }

]