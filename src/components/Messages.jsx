export const Messages = ({ messages }) => {
    return (
        <>
            {
                messages.map((message, index) => (
                    <div className={(message.role == 'assistant' ? 'eris ' : 'own ') + 'container'}>
                        <div key={index} className={(message.role == 'assistant' ? 'erisMessage ' : 'ownMessage ') + 'message'}>
                            <p>{message.content}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}
