using UnityEngine;

public class AudioManager : MonoBehaviour
{
    public PlayerMove playerMove; 
    public AudioSource movingAudioSource;

    [SerializeField] private float volPointA;
    [SerializeField] private float volPointB;

    private void Update()
    {

        if (playerMove.isMoving && !movingAudioSource.isPlaying)
        {
            movingAudioSource.Play();  
        }
        else if (!playerMove.isMoving && movingAudioSource.isPlaying)
        {
            movingAudioSource.Stop();  
        }

        AudioPan();

        movingAudioSource.volume = playerMove.GetValueBasedOnPos(playerMove.transform.position.y, volPointA, volPointB);
    }


    void AudioPan()
    {
        float distanceToPointA = Vector3.Distance(playerMove.transform.position, playerMove.pointAx.position);
        float distanceToPointB = Vector3.Distance(playerMove.transform.position, playerMove.pointBx.position);
        float totalDistance = distanceToPointA + distanceToPointB;
        float normalizedPan = distanceToPointA / totalDistance;
        movingAudioSource.panStereo = Mathf.Lerp(-1f, 1f, normalizedPan);
    }
}
