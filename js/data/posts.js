function getPosts() {
    return {
        0: {
            "title": "How to raise sea people?",
            "content": "Look at me, livin' free. Free and clean amongst the Sea People. " +
            "We look for pirates and search for gold.Life is an adventure with the Sea People. " +
            "They don't ever complain, they don't call me fat. They don't make me do homework " +
            "or nothin' like that.This is the way life was meant to be. Laughin' and singing, " +
            "Sea people and me. Sea people and me, you guys.",
            "tags": ["sea", "people", "raise"],
            "user": "TheRealEricCartman"
        },
        1: {
            "title": "Who killed Kanye West",
            "content": "Yo, uh, uh c'mon\n" +
            "\n" +
            "I've been so lonely girl, I've been so sad and down\n" +
            "Couldn't understand why haters joked around\n" +
            "I wanted to be free with other creatures like me\n" +
            "And now I got my wish, cause i know that I'm a gay fish (gay fish)\n" +
            "\n" +
            "(Gay fish Yo) mother fuckin' gay fish\n" +
            "(I'm a fish yo) goin' on a gay fish\n" +
            "(It's alright girl) makin' love to other gay fish\n" +
            "\n" +
            "All those lonely nights at the grocery store\n" +
            "In the frozen fish aisle feelin' like a whore\n" +
            "Cause I wasn't being true\n" +
            "Even though everyone said that I had to make a switch\n" +
            "(Gay fish) now I know that I'm a gay fish (gay fish)\n" +
            "\n" +
            "(Gay fish Yo) mother fuckin' gay fish\n" +
            "(I'm a fish yo) Goin' on a gay fish\n" +
            "(Now I'm where i belong girl) makin' love to other gay fish",
            "tags": ["sea", "fish", "gay"],
            "user": "FishStix"
        },
        2: {
            "title": "How to raise child?",
            "content": "How does one raise a child????? HALP!!",
            "tags": ["seapeople", "child", "human"],
            "user": "Joanna"
        }
    }
}

function getSearchResults(clicked) {
    if (clicked == null) {
        return [0, 1]
    }
    return [0, 1, 2]
}

function getAnswers() {
    return {
        0 :[
            {
                "user": "KyleB",
                "rating": 12,
                "content": "You suck Cartmen!",
                "id": 2
            },
            {
                "user": "Kenny",
                "rating": 0,
                "content": "*muffled yelling*",
                "id": 1,
                "replies": [
                    {
                        "user": "KyleB",
                        "rating": 1,
                        "content": "Kenny what did you say!",
                        "id": 3
                    },
                ]
            }
        ]
    }
}
