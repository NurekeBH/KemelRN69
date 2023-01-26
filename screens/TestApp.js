import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { NodeHtmlMarkdown } from 'node-html-markdown'

const html = `22225555
<div><br></div><ul><li><span style="font-size: 1.15em;">ffffffdsf</span><br></li><li><span style="font-size: 1.15em;">fsdfs</span></li><li><span style="font-size: 1.15em;">df</span></li><li><span style="font-size: 1.15em;">sf</span></li></ul><div><img style="width:390px;height:244px;" src="https://app.kemeladam.kz/media/uploads/share/2023/01/24/filename.jpg"><font size="5"><br></font></div><div><br></div>`
export default class TestApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            renderedText: ""
        };
    }



    render() {
        const { renderedText } = this.state
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Text> TestApp </Text>
                <TouchableOpacity
                    onPress={() => {
                        // const turndownService = new TurndownService();

                        // const markdown = turndownService.turndown(html);;

                        let markdown = NodeHtmlMarkdown.translate(
                            html,
                            {
                                ignore: ['img']
                            },
                            undefined,
                            undefined
                        );


                        this.setState({
                            renderedText: markdown
                        })

                        console.log('sharehmtl', markdown)
                    }}

                    style={{ margin: 16 }}>
                    <Text> TO HTML</Text>
                </TouchableOpacity>

                <Text>{renderedText}</Text>
            </View>
        );
    }
}
