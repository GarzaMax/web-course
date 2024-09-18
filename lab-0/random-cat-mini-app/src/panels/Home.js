import {Panel, PanelHeader, Header, Button, Group, Cell, Div, Avatar} from '@vkontakte/vkui';
import {useRouteNavigator} from '@vkontakte/vk-mini-apps-router';
import vkBridge from '@vkontakte/vk-bridge';
import PropTypes from 'prop-types';
import React, {useState} from 'react';

export const Home = ({id, fetchedUser}) => {
    const {photo_200, city, first_name, last_name} = {...fetchedUser};
    const routeNavigator = useRouteNavigator();
    const [loading, setLoading] = useState(false);

    const getRandomCat = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://api.thecatapi.com/v1/images/search', {
                headers: {
                    'x-api-key': 'live_vCRdCqpm7WIYrHfOQwdTKRcsObtobmep9BgqV27FrmHu4mIKOSnxAhJfWvisaP2Y',
                },
            });
            const data = await response.json();
            return data[0].url;
        } catch (error) {
            console.error('Ошибка при получении картинки кота:', error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    const showCatStory = async () => {
        const catUrl = await getRandomCat();
        if (catUrl) {
            vkBridge.send('VKWebAppShowStoryBox', {
                background_type: 'image',
                url: catUrl,
                locked: false,
            });
        }
    };

    return (
        <Panel id={id}>
            <PanelHeader>Главная</PanelHeader>
            {fetchedUser && (
                <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
                    <Cell before={photo_200 && <Avatar src={photo_200}/>} subtitle={city?.title}>
                        {`${first_name} ${last_name}`}
                    </Cell>
                </Group>
            )}

            <Group header={<Header mode="secondary">Navigation Example</Header>}>
                <Div>
                    <Button stretched size="l" mode="secondary" onClick={showCatStory} disabled={loading}>
                        {loading ? 'Загрузка кота...' : 'Показать кота!'}
                    </Button>
                </Div>
            </Group>
        </Panel>
    );
};

Home.propTypes = {
    id: PropTypes.string.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};